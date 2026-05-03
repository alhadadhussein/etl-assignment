# Architecture Document

## 1. Architecture Pattern

The app has two main parts:

- The **frontend** is a single page app (SPA) that runs in the browser. It handles user login, lets the user upload a CSV file, and shows messages to the user.
- The **backend** is an API server. It checks the user's access token, validates the uploaded file, and saves it to private blob storage in Azure.

The frontend is hosted separately from the backend.

How uploading works:

1. The user logs in on the frontend using their Microsoft account.
2. The frontend gets a token after login.
3. The user selects a CSV file and uploads it.
4. The frontend sends the file and the access token to the backend API.
5. The backend checks the token, validates the file, and saves it to storage.
6. The backend sends a response back to the frontend.

---

## 2. Tech Stack and Reasoning

**Frontend — Vue 3 + Vite**  
Vue 3 is used for the frontend because it is simple, fast, and easy to learn. It enables building a modern single-page app without much setup. Vite is chosen as the build tool for quick project startup and smooth development.

**Frontend Login — Microsoft Entra ID**  
Microsoft's MSAL library is used for user login with Microsoft Entra ID. This keeps login secure and easy, without the need to build a custom login system or store passwords.

**Backend — NestJS**  
NestJS is a Node.js framework and is chosen for the backend because it encourages a clean and modular structure. Each service (auth, upload, storage) lives in its own module, making the code easy to follow and extend. TypeScript adds type safety across the whole project.

**File Storage — Azure Blob Storage**  
Files are stored in Azure Blob Storage. The connection between the backend and Blob Storage uses managed identity, so no keys are kept in the application settings. This is the recommended secure approach on Azure.

**Backend Hosting — Azure Web App**  
The backend is deployed as an Azure Web App because it is easy to set up, scales automatically, and supports secure connections via Managed Identity to other Azure services without storing passwords.

**Frontend Hosting — Azure Static Web Apps**  
The frontend is hosted on Azure Static Web Apps because it is simple, fast, and low-cost for static sites. Azure App Service is better for dynamic server-side apps, but is more complex and expensive for just static content.

---

## 3. Validation Logic

When a file is uploaded, the backend runs four checks in order:

1. **File extension** — the filename must end with `.csv`.
2. **MIME type** — the file type must be `text/csv`.
3. **File structure** — the file must have a header row and at least one data row.
4. **Required columns** — the header must contain all five of these columns (case-insensitive):
   - `site_id`, `site_name`, `country`, `city`, `floor_area_sqm`

If any check fails, the API returns an error with a clear message. These checks stop people from uploading files that are not safe or do not have the correct format or structure.

---

## 4. Identifier Logic

Each processed file gets a unique ID called a `file_id`, which is a SHA-256 hash of the file content. If the same file is uploaded twice, they produce the same hash, so it only gets stored once.

The `file_id` is also added as a new first column in the processed files, so each row has this id which makes it easier to trace back to the source file in case we need to investigate.

## 5. Blob Storage Structure

Files are stored in two separate containers in Azure Blob Storage:

```
raw-uploads/
  {userId}/
    {timestamp}_{original filename}
    e.g. abc123/2026-05-03T10:00:00.000Z_sites.csv

processed-files/
  {userId}/
    {file_id}.csv
    e.g. abc123/e3b0c44298fc...27ae41e4649b.csv
```

- **`raw-uploads`** — stores the original file as received. Kept for auditing, even if validation failed.
- **`processed-files`** — stores the enriched file with the `file_id` column added.
- The `userId` comes from the users access token, so each person's files are kept in their own folder.

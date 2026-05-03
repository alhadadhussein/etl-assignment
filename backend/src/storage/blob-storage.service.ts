import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

@Injectable()
export class BlobStorageService {
  private readonly logger = new Logger(BlobStorageService.name);
  private readonly blobServiceClient: BlobServiceClient;

  constructor(private readonly configService: ConfigService) {
    const accountUrl = this.configService.getOrThrow<string>('AZURE_STORAGE_ACCOUNT_URL');
    this.blobServiceClient = new BlobServiceClient(accountUrl, new DefaultAzureCredential());
  }

  async upload(data: Buffer, containerName: string, blobPath: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    this.logger.log(`Uploading blob — container: ${containerName}, path: ${blobPath}, size: ${data.length} bytes`);

    await blockBlobClient.uploadData(data, {
      blobHTTPHeaders: { blobContentType: 'text/csv' },
    });

    this.logger.log(`Blob uploaded successfully — ${containerName}/${blobPath}`);
    return blockBlobClient.url;
  }
}

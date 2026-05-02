import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

@Injectable()
export class BlobStorageService {
  private readonly blobServiceClient: BlobServiceClient;

  constructor(private readonly configService: ConfigService) {
    const accountUrl = this.configService.getOrThrow<string>('AZURE_STORAGE_ACCOUNT_URL');
    this.blobServiceClient = new BlobServiceClient(accountUrl, new DefaultAzureCredential());
  }

  async upload(data: Buffer, containerName: string, blobPath: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    await blockBlobClient.uploadData(data, {
      blobHTTPHeaders: { blobContentType: 'text/csv' },
    });

    return blockBlobClient.url;
  }
}

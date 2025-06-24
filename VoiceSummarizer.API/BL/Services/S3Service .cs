using System;
using Amazon.S3;
using Amazon.S3.Model;
using BL.IService;
using Microsoft.Extensions.Configuration;

namespace BL.Services
{
    public class S3Service : IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"];

            Console.WriteLine("🪣 [S3Service] Bucket name loaded from config: " + _bucketName);
        }

        public string GeneratePresignedUrl(string fileName, string contentType)
        {
            try
            {
                Console.WriteLine("🔄 [GeneratePresignedUrl] Start generating URL...");
                Console.WriteLine($"📦 Bucket: {_bucketName}");
                Console.WriteLine($"📁 FileName: {fileName}");
                Console.WriteLine($"📄 ContentType: {contentType}");

                if (string.IsNullOrWhiteSpace(_bucketName))
                {
                    throw new Exception("❌ Bucket name is not configured in environment variables or config.");
                }

                var key = $"uploads/{Guid.NewGuid()}_{fileName}";
                Console.WriteLine($"🔑 Generated Key: {key}");

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    ContentType = contentType
                };

                var url = _s3Client.GetPreSignedURL(request);

                Console.WriteLine($"✅ [GeneratePresignedUrl] URL generated successfully: {url}");

                return url;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [GeneratePresignedUrl] Error: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw new ApplicationException("Error generating presigned URL", ex);
            }
        }
    }
}


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
        }

        public string GeneratePresignedUrl(string fileName, string contentType)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_bucketName))
                    throw new Exception("Bucket name is not configured.");

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = $"uploads/{Guid.NewGuid()}_{fileName}",
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    ContentType = contentType
                };

                return _s3Client.GetPreSignedURL(request);
            }
            catch (Exception ex)
            {
                // כדאי גם ללוגג
                throw new ApplicationException("Error generating presigned URL", ex);
            }
        }

    }
}

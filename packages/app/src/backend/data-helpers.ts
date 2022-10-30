import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
  httpOptions: { timeout: 0 },
});

const bucket = "npmdocs";

export const uploadFile = async (target: string, fileContent: string) => {
  const { Bucket, Key, ETag, Location } = await s3
    .upload(
      {
        Body: fileContent,
        Bucket: bucket,
        Key: target,
      },
      {
        partSize: 64 * 1024 * 1024,
      }
    )
    .promise();
  console.log(
    `Uploaded ${target} to ${Location} with ETag ${ETag}, Bucket ${Bucket}, Key ${Key}`
  );
};

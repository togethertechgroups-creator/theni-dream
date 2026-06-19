import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req) {
  try {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const endpoint = process.env.R2_ENDPOINT;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrlBase = process.env.R2_PUBLIC_URL;

    if (!accessKeyId || !secretAccessKey || !endpoint || !bucketName || !publicUrlBase) {
      return NextResponse.json({ configured: false });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const fileName = formData.get('fileName');

    if (!file || !fileName) {
      return NextResponse.json({ success: false, error: 'Missing file or fileName' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const s3 = new S3Client({
      region: 'auto',
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3.send(command);

    // Construct the public URL for R2 bucket file
    const fileUrl = `${publicUrlBase.replace(/\/$/, '')}/${fileName}`;

    return NextResponse.json({ configured: true, success: true, url: fileUrl });
  } catch (err) {
    console.error('R2 upload failed:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';
import _ from 'lodash';
// import fs from 'fs';
// import path from 'path';

dotenv.config();

const config = {
  imap: {
    user: process.env.IMAP_USER || "example@gmail.com",
    password: process.env.IMAP_PASS || "example",
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
}};

// フォルダが存在しなければ作成
// function ensureAttachmentsDir(dir: string) {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// }

export async function fetchEmails() {
  const connection = await imaps.connect(config);
  await connection.openBox('INBOX');

  const delay = 24 * 3600 * 1000;
  const yesterday = new Date(Date.now() - delay).toISOString();
  const searchCriteria = ['ALL', ['SINCE', yesterday]];

  const fetchOptions = { bodies: [''], struct: true }; // 本文全体を取得するため空の配列指定
  const messages = await connection.search(searchCriteria, fetchOptions);
  

  for (const message of messages) {
    const all = _.find(message.parts, { "which": "" });
    if (!all || !all.body) {
      console.log(`⚠️ メールID ${message.attributes.uid} の本文が取得できませんでした`);
      continue;
    }

    const id = message.attributes.uid;
    const idHeader = `Imap-Id: ${id}\r\n`;

    const mail = await simpleParser(idHeader + all.body);

    console.log('差出人:', mail.from?.text);
    console.log('件名:', mail.subject);
    console.log('本文:', mail.text); 
    
    // 添付ファイルがあれば
    // mail.attachments.forEach(attachment => {
    //   console.log('添付ファイル:', attachment.filename);
    //   // 添付ファイル保存用のディレクトリ
    //   const attachmentsDir = path.join(__dirname, 'attachments');
    //   ensureAttachmentsDir(attachmentsDir);

    //   if (attachment.filename) {
    //     const filePath = path.join(attachmentsDir, attachment.filename);
    //     fs.writeFileSync(filePath, attachment.content);
    //     console.log('添付ファイルを保存しました:', filePath);
    //   } else {
    //     console.log('添付ファイルのファイル名がありません');
    //   }
    // });
  }

  connection.end();
}

fetchEmails().catch(console.error);
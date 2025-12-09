import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

// .env ファイルから環境変数を読み込む
dotenv.config();

// 環境変数からサービスアカウントキーを取得
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error(
    'FIREBASE_SERVICE_ACCOUNT_KEY 環境変数が設定されていません。'
  );
}

// Firebase Admin SDK を初期化
// サービスアカウントキーを使用して認証を行う
const serviceAccount = JSON.parse(serviceAccountKey);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore データベースのインスタンスを取得
const db = admin.firestore();

// InMemoryDataService と同じ heroes データ
const heroes = [
  { id: 12, name: 'Dr. Nice' },
  { id: 13, name: 'Bombasto' },
  { id: 14, name: 'Celeritas' },
  { id: 15, name: 'Magneta' },
  { id: 16, name: 'RubberMan' },
  { id: 17, name: 'Dynama' },
  { id: 18, name: 'Dr. IQ' },
  { id: 19, name: 'Magma' },
  { id: 20, name: 'Tornado' },
];

async function seedFirestore() {
  try {
    console.log('Firestore への初期データ投入を開始します...');

    // エミュレーター接続の確認
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      console.log(
        `エミュレーターに接続します: ${process.env.FIRESTORE_EMULATOR_HOST}`
      );
    }

    // バッチ処理を使用して複数のドキュメントを一度に追加
    // バッチ処理を使うことで、効率的にデータを追加できます
    const batch = db.batch();
    const heroesRef = db.collection('heroes');

    // 各 hero を Firestore に追加
    heroes.forEach((hero) => {
      // ドキュメント ID として hero.id を使用（例: "12", "13"）
      const docRef = heroesRef.doc(hero.id.toString());
      // ドキュメントに id と name を設定
      batch.set(docRef, {
        id: hero.id,
        name: hero.name,
      });
    });

    // バッチ処理を実行して、すべてのデータを一度に Firestore に追加
    await batch.commit();
    console.log(
      `${heroes.length} 件の Hero データを Firestore に投入しました。`
    );

    // 投入されたデータを確認
    const snapshot = await heroesRef.get();
    console.log('\n投入されたデータ:');
    snapshot.forEach((doc) => {
      console.log(`  - ${doc.id}: ${JSON.stringify(doc.data())}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
}

seedFirestore();

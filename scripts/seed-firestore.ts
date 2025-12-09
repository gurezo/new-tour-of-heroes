import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

// .env ファイルから環境変数を読み込む
dotenv.config();

// エミュレーター接続の確認
// Firebase Admin SDKは、FIRESTORE_EMULATOR_HOST環境変数が設定されている場合のみエミュレーターに接続します
const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

// Firebase Admin SDK を初期化
// エミュレーター使用時は認証情報不要、本番環境ではサービスアカウントキーが必要
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (isEmulator) {
  // エミュレーター使用時は認証情報なしで初期化
  // FIRESTORE_EMULATOR_HOST環境変数が設定されている場合、自動的にエミュレーターに接続されます
  // プロジェクトIDは .firebaserc の設定に合わせる必要があります
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: 'new-tour-of-heroes', // .firebaserc のプロジェクトIDに合わせる
    });
  }
} else {
  // 本番環境ではサービスアカウントキーが必要
  if (!serviceAccountKey) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY 環境変数が設定されていません。\n' +
        '\n' +
        'エミュレーターを使用する場合は、以下のいずれかの方法で環境変数を設定してください：\n' +
        '  1. コマンドライン: export FIRESTORE_EMULATOR_HOST=localhost:8080\n' +
        '  2. .env ファイル: FIRESTORE_EMULATOR_HOST=localhost:8080 を追加\n' +
        '\n' +
        '本番環境を使用する場合は、FIREBASE_SERVICE_ACCOUNT_KEY を設定してください。'
    );
  }
  const serviceAccount = JSON.parse(serviceAccountKey);
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
}

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
    if (isEmulator) {
      console.log(
        `エミュレーターに接続します: ${process.env.FIRESTORE_EMULATOR_HOST}`
      );
    } else {
      console.log('本番環境の Firestore に接続します');
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

import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Hero } from './entities/hero.entity';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Injectable()
export class HeroesService {
  private firestore: admin.firestore.Firestore;
  private collection = 'heroes';

  constructor() {
    // Firebase Admin SDK が初期化されていない場合は初期化
    if (admin.apps.length === 0) {
      const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

      if (isEmulator) {
        // エミュレーター使用時
        admin.initializeApp({
          projectId: 'new-tour-of-heroes',
        });
      } else {
        // 本番環境
        if (!serviceAccountKey) {
          throw new Error(
            'FIREBASE_SERVICE_ACCOUNT_KEY 環境変数が設定されていません。'
          );
        }
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }
    }

    this.firestore = admin.firestore();
  }

  async findAll(): Promise<Hero[]> {
    const snapshot = await this.firestore.collection(this.collection).get();
    return snapshot.docs.map((doc) => doc.data() as Hero);
  }

  async findOne(id: number): Promise<Hero> {
    const doc = await this.firestore
      .collection(this.collection)
      .where('id', '==', id)
      .limit(1)
      .get();

    if (doc.empty) {
      throw new NotFoundException(`Hero with id ${id} not found`);
    }

    return doc.docs[0].data() as Hero;
  }

  async search(name?: string): Promise<Hero[]> {
    if (!name) {
      return this.findAll();
    }

    const snapshot = await this.firestore
      .collection(this.collection)
      .where('name', '>=', name)
      .where('name', '<=', name + '\uf8ff')
      .get();

    return snapshot.docs.map((doc) => doc.data() as Hero);
  }

  async create(createHeroDto: CreateHeroDto): Promise<Hero> {
    const heroes = await this.findAll();
    const maxId = Math.max(...heroes.map((h) => h.id), 0);
    const newHero: Hero = {
      id: maxId + 1,
      name: createHeroDto.name,
    };

    await this.firestore
      .collection(this.collection)
      .doc(newHero.id.toString())
      .set(newHero);

    return newHero;
  }

  async update(id: number, updateHeroDto: UpdateHeroDto): Promise<Hero> {
    const hero = await this.findOne(id);
    const updatedHero = { ...hero, ...updateHeroDto };

    await this.firestore
      .collection(this.collection)
      .doc(id.toString())
      .update(updatedHero);

    return updatedHero as Hero;
  }

  async remove(id: number): Promise<void> {
    const hero = await this.findOne(id);
    await this.firestore
      .collection(this.collection)
      .doc(id.toString())
      .delete();
  }
}

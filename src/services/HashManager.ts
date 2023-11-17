import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Hash é o método onde a gente pega uma senha e transforma ela em um código(Hash) que é um algoritmo do bcrypt.
// É possível pegar o Hash gerado e saber se ela veio de uma senha específica, mas não é possível pegar a senha a partir do Hash.

// Tranforma a senha em hash:
export class HashManager {
    public hash = async (plaintext: string): Promise<string> => {
        const rounds = Number(process.env.BCRYPT_COST);
        const salt = await bcrypt.genSalt(rounds);
        const hash = await bcrypt.hash(plaintext, salt);

        return hash;
    };

    // Verifica se é possível gerar uma determinada hash a partir de uma determinada senha
    public compare = async (
        plaintext: string,
        hash: string
    ): Promise<boolean> => {
        // aqui não precisa do await porque o return já se comporta como um
        return bcrypt.compare(plaintext, hash);
    };
}

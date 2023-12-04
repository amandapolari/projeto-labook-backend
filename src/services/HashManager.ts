import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Tranforma a `plaintext`(senha) em `hash`:
export class HashManager {
    public hash = async (plaintext: string): Promise<string> => {
        const rounds = Number(process.env.BCRYPT_COST);
        const salt = await bcrypt.genSalt(rounds);
        const hash = await bcrypt.hash(plaintext, salt);

        return hash;
    };

    // Verifica se é possível gerar uma determinada `hash` a partir de uma determinada `plaintext`(senha):
    public compare = async (
        plaintext: string,
        hash: string
    ): Promise<boolean> => {
        return bcrypt.compare(plaintext, hash);
    };
}

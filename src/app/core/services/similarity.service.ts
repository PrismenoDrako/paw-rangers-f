import { Injectable } from '@angular/core';

export interface SimilarPet {
    id: string;
    name: string;
    species: string;
    breed: string;
    gender: string;
    age: number;
    imageUrl?: string;
    description: string;
    similarity: number; // 0-100
}

export interface ReportData {
    species: string;
    breed?: string;
    gender?: string;
    age?: number;
    description: string;
    imageUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SimilarityService {

    constructor() { }

    /**
     * Encuentra mascotas perdidas similares a un hallazgo
     */
    findSimilarLostPets(foundPet: ReportData): SimilarPet[] {
        const lostPets = this.getLostPetsFromStorage();
        return this.findSimilarPets(foundPet, lostPets);
    }

    /**
     * Encuentra mascotas encontradas similares a una pérdida
     */
    findSimilarFoundPets(lostPet: ReportData): SimilarPet[] {
        const foundPets = this.getFoundPetsFromStorage();
        return this.findSimilarPets(lostPet, foundPets);
    }

    /**
     * Calcula similitud entre dos mascotas
     */
    private findSimilarPets(reportedPet: ReportData, storedPets: any[]): SimilarPet[] {
        const results: SimilarPet[] = [];

        storedPets.forEach(storedPet => {
            const similarity = this.calculateSimilarity(reportedPet, storedPet);

            // Solo incluir si la similitud es >= 50%
            if (similarity >= 50) {
                results.push({
                    id: storedPet.id,
                    name: storedPet.name,
                    species: storedPet.species,
                    breed: storedPet.breed,
                    gender: storedPet.gender,
                    age: storedPet.age,
                    imageUrl: storedPet.imageUrl,
                    description: storedPet.description,
                    similarity: Math.round(similarity)
                });
            }
        });

        // Ordenar por similitud descendente
        return results.sort((a, b) => b.similarity - a.similarity);
    }

    /**
     * Calcula un score de similitud (0-100) entre dos mascotas
     */
    private calculateSimilarity(pet1: ReportData, pet2: any): number {
        let score = 0;
        let maxScore = 100;

        // Similitud de especie (40 puntos)
        if (this.normalizeString(pet1.species) === this.normalizeString(pet2.species)) {
            score += 40;
        } else {
            // Penalización si no es la misma especie
            maxScore = 60;
        }

        // Similitud de raza (25 puntos)
        if (pet1.breed && pet2.breed) {
            if (this.normalizeString(pet1.breed) === this.normalizeString(pet2.breed)) {
                score += 25;
            } else {
                // Similitud parcial si contiene palabras clave
                if (this.hasSimilarWords(pet1.breed, pet2.breed)) {
                    score += 10;
                }
            }
        }

        // Similitud de género (15 puntos)
        if (pet1.gender && pet2.gender) {
            if (this.normalizeString(pet1.gender) === this.normalizeString(pet2.gender)) {
                score += 15;
            }
        }

        // Similitud de edad (10 puntos) - máximo 2 años de diferencia
        if (pet1.age !== undefined && pet2.age !== undefined) {
            const ageDifference = Math.abs(pet1.age - pet2.age);
            if (ageDifference <= 2) {
                score += 10;
            } else if (ageDifference <= 5) {
                score += 5;
            }
        }

        // Similitud de descripción (10 puntos)
        if (pet1.description && pet2.description) {
            const similarity = this.calculateTextSimilarity(pet1.description, pet2.description);
            if (similarity > 0.5) {
                score += 10;
            } else if (similarity > 0.3) {
                score += 5;
            }
        }

        return Math.min(score, maxScore);
    }

    /**
     * Calcula similitud entre dos textos (Levenshtein distance)
     */
    private calculateTextSimilarity(text1: string, text2: string): number {
        const words1 = this.normalizeString(text1).split(' ');
        const words2 = this.normalizeString(text2).split(' ');

        let matches = 0;
        words1.forEach(word => {
            if (words2.some(w => w.includes(word) || word.includes(w))) {
                matches++;
            }
        });

        return matches / Math.max(words1.length, words2.length);
    }

    /**
     * Normaliza un string para comparación
     */
    private normalizeString(str: string): string {
        return str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    }

    /**
     * Verifica si hay palabras similares entre dos strings
     */
    private hasSimilarWords(str1: string, str2: string): boolean {
        const words1 = this.normalizeString(str1).split(' ');
        const words2 = this.normalizeString(str2).split(' ');

        return words1.some(w1 => words2.some(w2 =>
            w1.length > 2 && (w1.includes(w2) || w2.includes(w1))
        ));
    }

    /**
     * Obtiene mascotas perdidas del localStorage
     */
    private getLostPetsFromStorage(): any[] {
        try {
            const data = localStorage.getItem('lostPets');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener mascotas perdidas:', error);
            return [];
        }
    }

    /**
     * Obtiene mascotas encontradas del localStorage
     */
    private getFoundPetsFromStorage(): any[] {
        try {
            const data = localStorage.getItem('foundPets');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error al obtener mascotas encontradas:', error);
            return [];
        }
    }
}

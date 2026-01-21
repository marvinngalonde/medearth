import { supabase } from '@/lib/supabase';

export type StorageBucket = 'avatars' | 'product-images' | 'pharmacy-images' | 'doctor-images' | 'prescriptions';

export const storageService = {
    // Upload a file to storage
    async uploadFile(
        bucket: StorageBucket,
        filePath: string,
        file: Blob | File,
        contentType?: string
    ) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                contentType: contentType || 'image/jpeg',
                upsert: true,
            });

        if (error) throw error;
        return data;
    },

    // Get public URL for a file
    getPublicUrl(bucket: StorageBucket, filePath: string) {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return data.publicUrl;
    },

    // Delete a file
    async deleteFile(bucket: StorageBucket, filePath: string) {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;
    },

    // Upload avatar
    async uploadAvatar(userId: string, file: Blob | File) {
        const filePath = `${userId}/avatar.jpg`;
        await this.uploadFile('avatars', filePath, file, 'image/jpeg');
        return this.getPublicUrl('avatars', filePath);
    },

    // Upload product image
    async uploadProductImage(productId: string, file: Blob | File) {
        const timestamp = Date.now();
        const filePath = `${productId}/${timestamp}.jpg`;
        await this.uploadFile('product-images', filePath, file, 'image/jpeg');
        return this.getPublicUrl('product-images', filePath);
    },

    // Upload prescription
    async uploadPrescription(userId: string, file: Blob | File) {
        const timestamp = Date.now();
        const filePath = `${userId}/${timestamp}.pdf`;
        await this.uploadFile('prescriptions', filePath, file, 'application/pdf');
        return this.getPublicUrl('prescriptions', filePath);
    },

    // Upload pharmacy image
    async uploadPharmacyImage(pharmacyId: string, file: Blob | File) {
        const filePath = `${pharmacyId}/main.jpg`;
        await this.uploadFile('pharmacy-images', filePath, file, 'image/jpeg');
        return this.getPublicUrl('pharmacy-images', filePath);
    },

    // Upload doctor image
    async uploadDoctorImage(doctorId: string, file: Blob | File) {
        const filePath = `${doctorId}/profile.jpg`;
        await this.uploadFile('doctor-images', filePath, file, 'image/jpeg');
        return this.getPublicUrl('doctor-images', filePath);
    },
};

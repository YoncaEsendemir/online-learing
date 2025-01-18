package com.eogrenme.MultipartUpload;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.web.multipart.MultipartFile;

public class UploadUserProfil {
    private static final String UPLOADED_FOLDER = "uploads/ProfileUpload/";
    public static String uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            return "No file uploaded";
        }
        try {
            // Dosya adını al
            String fileName = file.getOriginalFilename();
            Path path = Paths.get(UPLOADED_FOLDER, fileName);

            // Dizin var mı kontrol et
            File directory = new File(UPLOADED_FOLDER);
            if (!directory.exists()) {
                directory.mkdirs(); // Eğer dizin yoksa oluştur
            }

            // Dosyayı belirtilen yere kaydet
            Files.write(path, file.getBytes());

            // Frontend için göreli yol döndür
            return "/ProfileUpload/" + fileName; // Göreli yol döndür
        } catch (IOException e) {
            e.printStackTrace();
            return "File upload failed: " + e.getMessage();
        }
    }
}


package com.eogrenme.MultipartUpload;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.multipart.MultipartFile;

public class UploadFileVideoMulti {

private static String UPLOADED_VIDEO_FOLDER="uploads/CourseVideoFolder/";
public static String uploadVideoFile(MultipartFile file){
    if(file.isEmpty()){
      return "No file uploaded";
    }
    try{
        //Dosya adını al
        String fileName=file.getOriginalFilename();
        Path path=Paths.get(UPLOADED_VIDEO_FOLDER,fileName);

         // Dızının var olduğuna emin ol
         File directory = new File(UPLOADED_VIDEO_FOLDER);
         if(!directory.exists()){
            directory.mkdirs();  // Eğer dizin yoksa oluştur
         }
         //Dosyanın belirtilen yere kaydet
         Files.write(path, file.getBytes());
         // Frontend için göreli yol döndür
         return "/CourseVideoFolder/" + fileName; // Yüklenen dosyanın yolunu döndürülür
        
    }
    catch(IOException e){
        e.printStackTrace();
        return "File upload failed: " + e.getMessage();
    }
}


}

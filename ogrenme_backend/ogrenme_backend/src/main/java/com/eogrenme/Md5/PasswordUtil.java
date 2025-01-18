package com.eogrenme.Md5;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


public class PasswordUtil {
    
    public static String encryptWithMD5(String password){
       try{
        //"MD5" algoritması için özel olarak sınıfın bir örneğini oluşturur .
        MessageDigest md = MessageDigest.getInstance("MD5");
        //password.getBytes(): Şifreyi String formatından bayt dizisine çevirir.
        //md.update: Hash işlemini başlatır ve baytları MessageDigest nesnesine ekler.
        md.update(password.getBytes());
       // Amaç: Hash işleminden elde edilen özet değerini (digest) hesaplar.
    //md.digest(): MD5 algoritması uygulanır ve sonuç bir bayt dizisi olarak döner (128-bit).
        byte[] digest= md.digest();
      //  StringBuilder: Daha hızlı String manipülasyonu yapmak için kullanılan bir sınıf.
        StringBuilder sb = new StringBuilder();
        //Amaç: Bayt dizisini bir hexadecimal (16'lık tabanda) String'e dönüştürmek.
        for(byte b : digest){
            sb.append(String.format("%02x",b));
        }
        //Amaç: Hexadecimal String'i döndürür. Bu, MD5 hash sonucudur.
        return sb.toString();
       }catch(NoSuchAlgorithmException e){
        throw new RuntimeException("Şifre şifrelenirken hata oluştu",e);
       }
       
    }
}

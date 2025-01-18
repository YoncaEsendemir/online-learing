package com.eogrenme.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError<T> {

    private String errorCode; // Hata kodu
    private Date errorTime;    // Hatanın oluştuğu zaman
    private T errors;          // Hata detayları (generic tür)
}

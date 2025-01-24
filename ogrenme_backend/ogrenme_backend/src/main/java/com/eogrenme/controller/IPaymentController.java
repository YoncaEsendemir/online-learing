package com.eogrenme.controller;

import org.springframework.http.ResponseEntity;

import com.eogrenme.dto.DtoPayment;

public interface IPaymentController {
    ResponseEntity<String> processPayment(DtoPayment dtoPayment);
}

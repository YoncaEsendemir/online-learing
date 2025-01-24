package com.eogrenme.controller.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eogrenme.controller.IPaymentController;
import com.eogrenme.dto.DtoPayment;
import com.eogrenme.serviece.IServicePayment;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/api/payment")
public class PaymentController implements IPaymentController {

    @Autowired 
    IServicePayment paymentService;
 
    @Override
    @PostMapping("/save")
    public ResponseEntity<String> processPayment(@RequestBody DtoPayment dtoPayment) {
        try {
            DtoPayment dto = paymentService.processPayment(dtoPayment);
            if (dto != null) {
                return ResponseEntity.ok("Ödeme Başarılı");
            } else {
                return ResponseEntity.badRequest().body("Ödeme işlemi başarısız");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ödeme işlemi sırasında hata oluştu: " + e.getMessage());
        }
    }
}


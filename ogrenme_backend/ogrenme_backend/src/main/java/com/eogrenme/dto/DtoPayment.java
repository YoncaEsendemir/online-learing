package com.eogrenme.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoPayment {

  private Long userId;
  private String fullName;
  private Long courseId;
  private Double amount;
  private String paymentMethodId;

}


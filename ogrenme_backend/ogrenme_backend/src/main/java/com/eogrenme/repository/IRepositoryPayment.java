package com.eogrenme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eogrenme.entits.Payment;

@Repository

public interface IRepositoryPayment extends JpaRepository< Payment,Long>{

}

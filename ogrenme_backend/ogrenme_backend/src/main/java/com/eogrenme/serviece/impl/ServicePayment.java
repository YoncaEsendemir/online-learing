package com.eogrenme.serviece.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.eogrenme.dto.DtoPayment;
import com.eogrenme.entits.Payment;
import com.eogrenme.repository.IRepositoryPayment;
import com.eogrenme.serviece.IServicePayment;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

/*PaymentIntent: Stripe tarafından desteklenen ödeme süreci için kullanılan sınıf.
PaymentIntentCreateParams: Ödeme işlemi için parametrelerin ayarlanmasını sağlar. */

@Service
public class ServicePayment implements IServicePayment {

    @Autowired
    IRepositoryPayment paymentRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Override
    public DtoPayment processPayment(DtoPayment payment) {
        DtoPayment dto = new DtoPayment();
        Stripe.apiKey = stripeApiKey;
        try {
            PaymentIntentCreateParams params =
                    // Ödeme işlemi için Stripe parametrelerini ayarlayan bir yapılandırıcı.
                    PaymentIntentCreateParams.builder()
                            // Ödeme miktarını (kuruş cinsinden) ayarlar
                            .setAmount((long) (payment.getAmount() * 100))
                            // Türk Lirası (TRY) cinsinden işlem yapılacağını belirtir
                            .setCurrency("try")
                            // setPaymentMethod: Kullanıcıdan gelen paymentMethodId (ödeme yöntemi)
                            // Stripe'dan alınır.
                            .setPaymentMethod(payment.getPaymentMethodId())
                            // setConfirm(true): Ödemeyi oluşturduktan sonra otomatik olarak doğrular
                            .setConfirm(true)
                            .build();

            // PaymentIntent.create(params): Stripe sunucusuna yukarıda tanımlanan
            // parametrelerle bir ödeme işlemi başlatır.
            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // paymentIntent.getStatus(): Ödemenin durumunu döndürür (örneğin, succeeded,
            // requires_action).
            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Payment paymentdb: Yeni bir Payment varlığı oluşturulur.
                // setUserId, setFullName, setCourseId: Kullanıcıdan gelen bilgileri varlığa atar.
                Payment paymentdb = new Payment();
                paymentdb.setUserId(payment.getUserId());
                paymentdb.setFullName(payment.getFullName());
                paymentdb.setCourseId(payment.getCourseId());
                paymentdb.setAmount(payment.getAmount());
                paymentdb.setPaymentMethodId(payment.getPaymentMethodId());
                paymentRepository.save(paymentdb);

                BeanUtils.copyProperties(paymentdb, dto);
                return dto;
            } else {
                throw new RuntimeException("Ödeme işlemi başarısız: " + paymentIntent.getStatus());
            }
        } catch (Exception e) {
            throw new RuntimeException("Ödeme işlemi başarısız: " + e.getMessage());
        }
    }
}

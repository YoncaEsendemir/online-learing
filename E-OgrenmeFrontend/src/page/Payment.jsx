import React, { useState } from "react"
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { processPayment } from "../redux/slice/paymentSlice"
import {saveEnrollment} from "../redux/slice/enrollmentSlice"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js"
import "../css/Payment.css"

//	Kart bilgisi alma, ödeme başlangıcı.
const stripePromise = loadStripe(
  "pk_test_51QDQodDxkECcESEIhoqzTZ4aAHYT4rEenGkvwu63pGHAIZZ0v1e3wAoaOdIHQYUePQ7lRFPyY6WrocHpKjXyyymB00LgGMBKH8"
)

const PaymentForm = ({ loggedInUser, courseId, amount, navigate, dispatch }) => {
  const [fullName, setFullName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState(null)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)
    setCardError(null)

    const cardElement = elements.getElement(CardElement)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    })

    if (error) {
      console.error(error)
      setCardError(error.message)
      setIsProcessing(false)
      return
    }

    const paymentData = {
      userId: loggedInUser.id,
      fullName: fullName,
      courseId: courseId,
      amount: amount,
      paymentMethodId: paymentMethod.id,
    }

const enrollmentData ={
  userId:loggedInUser.id,
  courseId:courseId,
  //progress:50.52,
}

    dispatch(processPayment(paymentData))
      .unwrap()
      .then(() => {
        dispatch(saveEnrollment(enrollmentData));
        alert("Ödeme başarıyla tamamlandı ve kursa kaydolundu!")
        navigate("/dashboard")
      })
      .catch((error) => {
        setCardError("Ödeme sırasında bir hata oluştu: " + error)
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Ad Soyad</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ad Soyad"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Kurs Adı</Form.Label>
        <Form.Control type="text" value={`Kurs ID: ${courseId}`} disabled />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ödeme Tutarı</Form.Label>
        <Form.Control type="text" value={amount || "Bilinmiyor"} disabled />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Kart Bilgileri (Test Modu)</Form.Label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        {cardError && <div className="text-danger mt-2">{cardError}</div>}
        <small className="text-muted">Test için: 4242424242424242, 12/25, 123</small>
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100" disabled={!stripe || isProcessing}>
        {isProcessing ? "İşleniyor..." : "Ödemeyi Tamamla ve Kursa Kaydol"}
      </Button>
    </Form>
  )
}

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loggedInUser } = useSelector((state) => state.user)

  const courseId = location.state?.courseId || 101
  const amount = location.state?.amount || "Bilinmiyor"

  if (!loggedInUser) {
    alert("Kullanıcı girişi yapılmamış.")
    navigate("/login")
    return null
  }

  return (
    <div className="payment-page">
      <Container className="payment-container">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header as="h2" className="text-center">
                Ödeme Sayfası (Test Modu)
              </Card.Header>
              <Card.Body>
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    loggedInUser={loggedInUser}
                    courseId={courseId}
                    amount={amount}
                    navigate={navigate}
                    dispatch={dispatch}
                  />
                </Elements>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Payment

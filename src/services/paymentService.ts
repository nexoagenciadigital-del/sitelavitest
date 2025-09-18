// Serviço de pagamento integrado
export interface PaymentData {
  method: 'credit' | 'pix' | 'boleto';
  amount: number;
  customerData: {
    name: string;
    email: string;
    phone: string;
    document: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  creditCard?: {
    number: string;
    holderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  pixCode?: string;
  boletoUrl?: string;
  error?: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Simulação de integração com gateway de pagamento (Mercado Pago/PagSeguro)
export const processPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    // Validações básicas
    if (!paymentData.customerData.name || !paymentData.customerData.email) {
      throw new Error('Dados do cliente incompletos');
    }

    if (paymentData.method === 'credit' && !paymentData.creditCard) {
      throw new Error('Dados do cartão de crédito são obrigatórios');
    }

    // Simular diferentes cenários baseados no método de pagamento
    switch (paymentData.method) {
      case 'credit':
        // Simular aprovação/rejeição baseada no número do cartão
        const cardNumber = paymentData.creditCard?.number.replace(/\s/g, '') || '';
        const isApproved = !cardNumber.endsWith('0000'); // Cartões terminados em 0000 são rejeitados
        
        return {
          success: isApproved,
          transactionId: isApproved ? `TXN_${Date.now()}` : undefined,
          status: isApproved ? 'approved' : 'rejected',
          error: isApproved ? undefined : 'Cartão recusado pela operadora'
        };

      case 'pix':
        // Gerar código PIX simulado
        const pixCode = `00020126580014BR.GOV.BCB.PIX0136${Date.now()}@lavibaby.com.br5204000053039865802BR5913LAVIBABY LTDA6009SAO PAULO62070503***6304`;
        
        return {
          success: true,
          transactionId: `PIX_${Date.now()}`,
          pixCode,
          status: 'pending'
        };

      case 'boleto':
        // Gerar URL do boleto simulado
        const boletoUrl = `https://www.exemplo.com/boleto/${Date.now()}.pdf`;
        
        return {
          success: true,
          transactionId: `BOL_${Date.now()}`,
          boletoUrl,
          status: 'pending'
        };

      default:
        throw new Error('Método de pagamento não suportado');
    }
  } catch (error) {
    return {
      success: false,
      status: 'rejected',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

// Validação de cartão de crédito
export const validateCreditCard = (cardNumber: string): boolean => {
  // Algoritmo de Luhn para validação de cartão
  const number = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(number)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Identificar bandeira do cartão
export const getCardBrand = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return 'Visa';
  if (/^5[1-5]/.test(number)) return 'Mastercard';
  if (/^3[47]/.test(number)) return 'American Express';
  if (/^6/.test(number)) return 'Discover';
  if (/^(4011|4312|4389|4514|4573)/.test(number)) return 'Elo';
  
  return 'Desconhecida';
};

// Calcular parcelas
export const calculateInstallments = (amount: number, maxInstallments: number = 12) => {
  const installments = [];
  
  for (let i = 1; i <= maxInstallments; i++) {
    const installmentAmount = amount / i;
    const hasInterest = i > 3; // Juros a partir da 4ª parcela
    const interestRate = hasInterest ? 0.0299 : 0; // 2.99% ao mês
    const finalAmount = hasInterest ? installmentAmount * (1 + interestRate * (i - 3)) : installmentAmount;
    
    installments.push({
      number: i,
      amount: finalAmount,
      total: finalAmount * i,
      hasInterest,
      label: i === 1 
        ? `À vista - R$ ${amount.toFixed(2).replace('.', ',')}`
        : `${i}x de R$ ${finalAmount.toFixed(2).replace('.', ',')} ${hasInterest ? 'com juros' : 'sem juros'}`
    });
  }
  
  return installments;
};

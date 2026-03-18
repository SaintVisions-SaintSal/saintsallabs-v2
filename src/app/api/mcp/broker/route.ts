import { NextRequest } from 'next/server'
import { validateRequest, gatewayResponse, handleOptions } from '@/lib/gateway-auth'

export const runtime = 'edge'

export async function OPTIONS() { return handleOptions() }

export async function POST(req: NextRequest) {
  const auth = validateRequest(req)
  if (!auth.valid) return gatewayResponse({ error: auth.error }, 401)

  try {
    const { action, payload } = await req.json()
    if (!action) return gatewayResponse({ error: 'action required' }, 400)

    switch (action) {
      case 'qualify_lead': {
        const { businessName, loanAmount, timeInBusiness, creditScore, monthlyRevenue, useOfFunds } = payload

        let score = 0
        const products: string[] = []
        const flags: string[] = []

        // Credit score scoring
        if (creditScore >= 720) score += 30
        else if (creditScore >= 680) score += 20
        else if (creditScore >= 620) score += 10
        else flags.push('Low credit score')

        // Time in business
        if (timeInBusiness >= 24) score += 25
        else if (timeInBusiness >= 12) score += 15
        else { score += 5; flags.push('Less than 12 months in business') }

        // Revenue
        const annualRevenue = monthlyRevenue * 12
        if (annualRevenue >= loanAmount * 1.5) score += 25
        else if (annualRevenue >= loanAmount) score += 15
        else flags.push('Revenue may not support loan amount')

        // Use of funds products
        if (['equipment', 'expansion'].includes(useOfFunds)) {
          products.push('SBA 7(a)', 'Equipment Financing', 'Business Term Loan')
          score += 20
        } else if (useOfFunds === 'working_capital') {
          products.push('Business Line of Credit', 'MCA', 'Revenue-Based Financing')
          score += 15
        } else {
          products.push('Business Term Loan', 'Business Line of Credit')
          score += 10
        }

        const tier = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'
        const nextStep = score >= 60 ? 'send_application' : score >= 40 ? 'schedule_call' : 'nurture'

        return gatewayResponse({
          ok: true,
          businessName,
          leadScore: Math.min(score, 100),
          tier,
          products,
          flags,
          nextStep,
          loanAmount,
          annualRevenue,
        })
      }

      case 'analyze_deal': {
        const { purchasePrice, noi, grossRent, expenses, downPayment, interestRate, loanTerm, annualDebtService } = payload

        const capRate = ((noi / purchasePrice) * 100).toFixed(2)
        const annualGrossRent = (grossRent || 0) * 12
        const annualExpenses = expenses || (annualGrossRent * 0.4)
        const calculatedNOI = annualGrossRent - annualExpenses
        const cashFlow = (noi || calculatedNOI) - (annualDebtService || 0)
        const cashOnCash = downPayment ? ((cashFlow / downPayment) * 100).toFixed(2) : '0.00'
        const dscr = annualDebtService ? ((noi || calculatedNOI) / annualDebtService).toFixed(2) : 'N/A'
        const grm = grossRent ? (purchasePrice / annualGrossRent).toFixed(1) : 'N/A'

        const dscrNum = parseFloat(dscr)
        const verdict = parseFloat(capRate) >= 6 && (isNaN(dscrNum) || dscrNum >= 1.25)
          ? 'DEAL' : parseFloat(capRate) >= 4 ? 'MARGINAL' : 'PASS'

        return gatewayResponse({
          ok: true,
          purchasePrice,
          capRate: `${capRate}%`,
          cashOnCash: `${cashOnCash}%`,
          dscr,
          grm,
          cashFlow,
          noi: noi || calculatedNOI,
          verdict,
          recommendation: verdict === 'DEAL'
            ? 'Strong fundamentals — proceed to due diligence'
            : verdict === 'MARGINAL'
            ? 'Negotiate price down or improve terms'
            : 'Returns do not meet threshold — skip',
        })
      }

      case 'calc_payment': {
        const { loanAmount, interestRate, loanTerm } = payload
        const monthlyRate = interestRate / 100 / 12
        const numPayments = loanTerm * 12
        const payment = monthlyRate === 0
          ? loanAmount / numPayments
          : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)

        return gatewayResponse({
          ok: true,
          monthlyPayment: parseFloat(payment.toFixed(2)),
          annualDebtService: parseFloat((payment * 12).toFixed(2)),
          totalPaid: parseFloat((payment * numPayments).toFixed(2)),
          totalInterest: parseFloat((payment * numPayments - loanAmount).toFixed(2)),
        })
      }

      default:
        return gatewayResponse({ error: `Unknown action: ${action}` }, 400)
    }

  } catch (err: any) {
    console.error('[MCP /broker]', err)
    return gatewayResponse({ error: 'Broker request failed', detail: err.message }, 500)
  }
}

import React from 'react'
import { TurkishPDFGenerator } from './utils/TurkishPDFGenerator'
import { generateCustomerDetailReport, CustomerData } from './utils/CustomerReportPDF'
import { 
  generateFinancialSummaryPDF,
  generateInvoicePDF, 
  generatePaymentPDF,
  generatePaymentsListPDF,
  generateProductPDF,
  generateProductsListPDF,
  generateReportPDF,
  generateWhatsAppAnalyticsPDF 
} from './utils/AllReportsPDF'

const PDFTestPage: React.FC = () => {
  
  // Test Customer Data - İsteklerinize göre müşteri verisi
  const testCustomerData: CustomerData = {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet@abcilac.com',
    phone: '+90 212 555 0101',
    company: 'ABC İlaç A.Ş.',
    segment: 'pharmaceutical',
    status: 'Aktif',
    createdAt: '2025-09-28',
    address: {
      street: 'Maslak Mah. Büyükdere Cad. No:123',
      city: 'İstanbul',
      state: 'Sarıyer',
      zipCode: '34485',
      country: 'Türkiye'
    },
    totalOrders: 0,
    totalSpent: 1250000,
    lastOrderDate: '2024-01-15',
    notes: 'Değerli müşteri. Düzenli siparişler veriyor.'
  }

  // Test Manual PDF Generation
  const testManualPDF = () => {
    const pdf = new TurkishPDFGenerator()
    
    // Test başlık
    pdf.addTitle('Türkçe PDF Test Raporu')
    
    // Test paragraf
    pdf.addParagraph('Bu test raporu Türkçe karakter desteğini test etmektedir. Özellikle ç, ğ, ı, ö, ş, ü karakterleri çalışmalıdır.')
    
    // Test bölüm başlığı  
    pdf.addSectionTitle('Türkçe Karakterler Testi')
    
    // Test bilgi kutusu
    const testInfo = [
      { label: 'Şirket Adı', value: 'ABC İlaç A.Ş.' },
      { label: 'Müşteri Segmenti', value: 'İlaç Sektörü' },
      { label: 'Ürün Çeşidi', value: 'Ağrı Kesiciler' },
      { label: 'Özel Notlar', value: 'Güçlü müşteri ilişkileri' }
    ]
    
    pdf.addInfoBox(testInfo)
    
    pdf.addSpace(20)
    
    // Test tablo
    const headers = ['Ürün Adı', 'Fiyat', 'Müşteri Görüşü']
    const rows = [
      ['Ağrı Kesici İlaç', 'TRY 125.50', 'Çok etkili'],
      ['Şeker İlacı', 'TRY 89.75', 'Güçlü formül'],  
      ['Öksürük Şurubu', 'TRY 67.25', 'İyi çalışıyor']
    ]
    
    pdf.addTable(headers, rows)
    
    // Test yatay çizgi
    pdf.addHorizontalLine()
    
    // Test son bölüm
    pdf.addSectionTitle('Özet ve Değerlendirme')
    pdf.addParagraph('Bu rapor tüm Türkçe karakterlerin doğru görüntülendiğini, A4 formatının uygulandığını ve 1cm kenar boşluklarının çalıştığını göstermektedir.')
    
    // PDF indirme
    pdf.download('Turkce_PDF_Test_Raporu.pdf')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Türkçe PDF Sistemi Test Sayfası
          </h1>
          <p className="text-gray-600 mb-8">
            Yeni PDF sistemini test edin. Tüm özellikler Türkçe karakter desteği ile çalışır.
          </p>

          {/* Test Button Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Manual PDF Test */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">
                🔧 Manuel PDF Test
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Tüm PDF özelliklerini test eder: A4 format, 1cm kenar, Türkçe karakter, başlık/altbilgi
              </p>
              <button
                onClick={testManualPDF}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Manuel Test PDF İndir
              </button>
            </div>

            {/* Customer Detail Report */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">
                👤 Müşteri Detay Raporu
              </h3>
              <p className="text-sm text-green-700 mb-4">
                İsteklerinize göre: Ahmet Yılmaz / ABC İlaç A.Ş. / pharmaceutical
              </p>
              <button
                onClick={() => generateCustomerDetailReport(testCustomerData)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
              >
                Müşteri Raporu İndir
              </button>
            </div>

            {/* Financial Reports */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-3">
                💰 Finans Raporları
              </h3>
              <p className="text-sm text-yellow-700 mb-4">
                Mali durum özeti ve finansal raporlar
              </p>
              <div className="space-y-2">
                <button
                  onClick={generateFinancialSummaryPDF}
                  className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                >
                  Finansal Özet
                </button>
                <button
                  onClick={generateInvoicePDF}
                  className="w-full bg-yellow-500 text-white px-4 py-1 rounded text-sm"
                >
                  Fatura Raporu
                </button>
              </div>
            </div>

            {/* Payment Reports */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-3">
                💳 Ödeme Raporları
              </h3>
              <p className="text-sm text-purple-700 mb-4">
                Ödeme kayıtları ve listeleri
              </p>
              <div className="space-y-2">
                <button
                  onClick={generatePaymentPDF}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                >
                  Ödeme Raporu
                </button>
                <button
                  onClick={generatePaymentsListPDF}
                  className="w-full bg-purple-500 text-white px-4 py-1 rounded text-sm"
                >
                  Ödeme Listesi
                </button>
              </div>
            </div>

            {/* Product Reports */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-3">
                📦 Ürün Raporları
              </h3>
              <p className="text-sm text-indigo-700 mb-4">
                Ürün bilgileri ve stok raporları
              </p>
              <div className="space-y-2">
                <button
                  onClick={generateProductPDF}
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                >
                  Ürün Raporu
                </button>
                <button
                  onClick={generateProductsListPDF}
                  className="w-full bg-indigo-500 text-white px-4 py-1 rounded text-sm"
                >
                  Ürün Listesi
                </button>
              </div>
            </div>

            {/* System Reports */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                📊 Sistem Raporları
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Genel sistem ve WhatsApp analytics
              </p>
              <div className="space-y-2">
                <button
                  onClick={generateReportPDF}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
                >
                  Genel Rapor
                </button>
                <button
                  onClick={generateWhatsAppAnalyticsPDF}
                  className="w-full bg-gray-500 text-white px-4 py-1 rounded text-sm"
                >
                  WhatsApp Analytics
                </button>
              </div>
            </div>

          </div>

          {/* Test Info */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              ✅ Test Edilen Özellikler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-medium mb-2">PDF Formatı:</h4>
                <ul className="space-y-1">
                  <li>• A4 sayfa boyutu (595x842pt)</li>
                  <li>• 1cm kenar boşlukları (28.35pt)</li>
                  <li>• Dikey (portrait) düzen</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Font Boyutları:</h4>
                <ul className="space-y-1">
                  <li>• Başlıklar: 24px (kalın)</li>
                  <li>• Bölüm başlıkları: 18px</li>
                  <li>• İçerik: 11px</li>
                  <li>• Altbilgi: 9px</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Türkçe Karakterler:</h4>
                <ul className="space-y-1">
                  <li>• ç, ğ, ı, ö, ş, ü</li>
                  <li>• Ç, Ğ, İ, Ö, Ş, Ü</li>
                  <li>• Unicode desteği</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Görsel Düzen:</h4>
                <ul className="space-y-1">
                  <li>• Başlık ve altbilgi</li>
                  <li>• Profesyonel renkler</li>
                  <li>• Sayfa numaraları</li>
                  <li>• İletişim bilgileri</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PDFTestPage
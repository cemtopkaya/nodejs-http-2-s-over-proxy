import http from 'http'; // HTTP modülü
import url from 'url'; // URL modülü
import { HttpProxyAgent } from 'http-proxy-agent'; 

// Proxy sunucu bilgileri
const PROXY_HOST = '192.168.188.36'; // Proxy sunucu adresi veya IP adresi
const PROXY_PORT = 777; // HTTP Proxy sunucu portu
const PROXY_PROTOCOL = 'http:'; // HTTP protokolü
// Proxy ayarları
const proxyOptions = {
  hostname: PROXY_HOST, // Proxy'nin IP adresi
  port: PROXY_PORT, // Proxy'nin port numarası
  protocol: PROXY_PROTOCOL, // Proxy'nin protokolü (http veya https)
};
// Proxy için HttpProxyAgent oluştur
const proxyAgent = new HttpProxyAgent(proxyOptions);


// Hedef URL
const targetUrl = 'http://example.com:80';

// URL'yi ayrıştırma
const urlParts = url.parse(targetUrl);

// İstek seçenekleri
const options = {
  hostname: urlParts.hostname,
  path: urlParts.path,
  port: urlParts.port, // http isteği 80 portundan gidecek
  method: 'GET', // İstek yöntemi (GET, POST, vb.)
  agent: proxyAgent, // Proxy ajanı ekleme
};

// HTTPS istek oluşturma
const req = http.request(options, (res) => {
  // Yanıt durumu kodunu yazdırma
  console.log(`Yanıt Durumu Kodu: ${res.statusCode}`);

  // Başlıkları yazdırma
  console.log('Başlıklar:');
  const headers = res.headers;
  for (const key in headers) {
    console.log(`${key}: ${headers[key]}`);
  }
  // Çıktı akışı (stream) zaten mevcuttur, direkt olarak okuma yapabilirsiniz
  res.on('data', (chunk) => {
    console.log(chunk.toString());
  });

  // Hata durumlarını ele alma
  res.on('error', (err) => {
    console.error('Hata:', err);
  });

  // Çıktı akışı tamamlandığında mesaj yazdırma
  res.on('end', () => {
    console.log('Yanıt Alındı.');
  });
});

// Hata durumlarını ele alma
req.on('error', (err) => {
  console.error('İstek Sırasında Hata:', err);
});

// İsteği gönderme
req.end();

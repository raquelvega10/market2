import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FAQSection } from './components/sections/FAQSection';
import { ContactSection } from './components/sections/ContactSection';
import { CategorySidebar } from './components/CategorySidebar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { CheckoutForm, OrderFormData } from './components/CheckoutForm';
import { Footer } from './components/Footer';
import { supabase, Category, SubCategory, Product, StockProducto, SiteSettings, SocialMedia } from './lib/supabase';
import { CartItem } from './types/cart';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMap, setStockMap] = useState<Map<string, StockProducto>>(new Map());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResult, subCategoriesResult, productsResult, stockResult, settingsResult, socialResult] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('sub_categories').select('*'),
        supabase.from('products').select('*'),
        supabase.from('stock_productos').select('*'),
        supabase.from('site_settings_general').select('*'),
        supabase.from('redes_sociales').select('*'),
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (subCategoriesResult.error) throw subCategoriesResult.error;
      if (productsResult.error) throw productsResult.error;
      if (stockResult.error) throw stockResult.error;
      if (settingsResult.error) throw settingsResult.error;
      if (socialResult.error) throw socialResult.error;

      setCategories(categoriesResult.data || []);
      setSubCategories(subCategoriesResult.data || []);
      setProducts(productsResult.data || []);
      setSiteSettings(settingsResult.data || []);
      setSocialMedia(socialResult.data || []);

      const stockMapData = new Map<string, StockProducto>();
      (stockResult.data || []).forEach((stock) => {
        stockMapData.set(stock.product_name, stock);
      });
      setStockMap(stockMapData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.category_name !== selectedCategory) return false;
    if (selectedSubCategory && product.sub_category_name !== selectedSubCategory) return false;

    const stock = stockMap.get(product.name);
    const stockAvailable = stock?.stock_actual || 0;
    if (stockAvailable <= 0) return false;

    return true;
  });

  const handleAddToCart = (product: Product, stockAvailable: number) => {
    if (stockAvailable <= 0) {
      setError('Producto sin stock disponible');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const existingItem = cartItems.find((item) => item.product_name === product.name);

    if (existingItem) {
      if (existingItem.quantity >= stockAvailable) {
        setError('No hay más stock disponible de este producto');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setCartItems(
        cartItems.map((item) =>
          item.product_name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          product_name: product.name,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          image_url: product.image_url,
          stock_available: stockAvailable,
        },
      ]);
    }

    setSuccessMessage('Producto agregado al carrito');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleUpdateQuantity = (productName: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productName);
      return;
    }

    const item = cartItems.find((item) => item.product_name === productName);
    if (item && quantity > item.stock_available) {
      setError('No hay suficiente stock disponible');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.product_name === productName ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productName: string) => {
    setCartItems(cartItems.filter((item) => item.product_name !== productName));
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const sendWhatsAppMessage = (orderData: OrderFormData, orderId: string, items: CartItem[], total: number) => {
    const phoneNumber = siteSettings.find(s => s.nombre === 'Telefono')?.valor || '17868830056';
    const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '');

    let message = `🛒 *NUEVO PEDIDO*\n\n`;
    message += `📋 *ID Pedido:* ${orderId.substring(0, 8)}\n\n`;

    message += `👤 *CLIENTE*\n`;
    message += `Nombre: ${orderData.cliente_fullname}\n`;
    message += `País: ${orderData.cliente_pais}\n`;
    message += `Email: ${orderData.cliente_email}\n`;
    message += `Contacto: ${orderData.cliente_contacto}\n\n`;

    message += `📦 *RECEPTOR*\n`;
    message += `Nombre: ${orderData.receptor_fullname}\n`;
    message += `CI: ${orderData.receptor_ci}\n`;
    message += `Contacto: ${orderData.receptor_contacto}\n`;
    message += `Dirección: ${orderData.receptor_direccion}\n`;
    if (orderData.receptor_adicionales) {
      message += `Adicionales: ${orderData.receptor_adicionales}\n`;
    }
    message += `\n`;

    message += `🛍️ *PRODUCTOS*\n`;
    items.forEach(item => {
      message += `• ${item.product_name}\n`;
      message += `  Cantidad: ${item.quantity}\n`;
      message += `  Precio: $${item.price.toFixed(2)}\n`;
      message += `  Subtotal: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `💰 *TOTAL: $${total.toFixed(2)}*\n`;
    message += `💳 Método de pago: ${orderData.payment_method}\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitOrder = async (orderData: OrderFormData) => {
    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          total,
          status: 'pendiente',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of cartItems) {
        const { error: stockError } = await supabase.from('stock').insert({
          product_name: item.product_name,
          movement_type: 'salida',
          quantity: item.quantity,
          note: `Pedido #${order.id}`,
        });

        if (stockError) throw stockError;
      }

      sendWhatsAppMessage(orderData, order.id, cartItems, total);

      setCartItems([]);
      setShowCheckout(false);
      setSuccessMessage('¡Pedido realizado exitosamente! Se ha enviado la información por WhatsApp.');
      setTimeout(() => setSuccessMessage(null), 5000);

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el pedido');
      console.error('Error:', err);
    }
  };

  const scrollToProducts = () => {
    const element = document.getElementById('productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartItemsCount={cartItems.length} onCartClick={() => setShowCart(true)} />

      {error && (
        <div className="fixed top-24 right-4 z-40 max-w-md animate-slide-up">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-24 right-4 z-40 max-w-md animate-slide-up">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

      <HeroSection onShopClick={scrollToProducts} onContactClick={scrollToContact} />
      <ProcessSection />

      <section id="productos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Productos</h2>
            <p className="text-xl text-gray-600">
              Selecciona de nuestro catálogo de productos de calidad
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <aside className="lg:col-span-1">
              <CategorySidebar
                categories={categories}
                subCategories={subCategories}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                onCategorySelect={setSelectedCategory}
                onSubCategorySelect={setSelectedSubCategory}
              />
            </aside>

            <div className="lg:col-span-4">
              {filteredProducts.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No se encontraron productos en esta categoría
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      stock={stockMap.get(product.name)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FAQSection />
      <ContactSection />

      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      )}

      {showCheckout && (
        <CheckoutForm
          items={cartItems}
          total={cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleSubmitOrder}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      )}

      <Footer siteSettings={siteSettings} socialMedia={socialMedia} />
    </div>
  );
}

export default App;

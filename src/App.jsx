import React, { useState, useEffect } from 'react'
import { User, Lock, LogOut, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Send, Search, Package, CheckCircle, AlertCircle, Loader2, Settings, Server, Wifi } from 'lucide-react'

// Componente de Configuración de Servidor
function ServerConfig({ onConnect }) {
  const [serverIp, setServerIp] = useState('')
  const [testing, setTesting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Intentar cargar IP guardada
    const saved = localStorage.getItem('wilpos_server_ip')
    if (saved) setServerIp(saved)
  }, [])

  const testConnection = async () => {
    if (!serverIp.trim()) {
      setError('Ingresa la IP del servidor')
      return
    }

    setTesting(true)
    setError('')

    try {
      const apiUrl = `http://${serverIp.trim()}:3001/api`
      const res = await fetch(`${apiUrl.replace('/api', '')}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      })

      if (res.ok) {
        localStorage.setItem('wilpos_server_ip', serverIp.trim())
        localStorage.setItem('wilpos_api_url', apiUrl)
        onConnect(apiUrl)
      } else {
        setError('No se pudo conectar al servidor')
      }
    } catch (err) {
      setError('Servidor no encontrado. Verifica la IP.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Server className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Conectar a WilPOS</h1>
          <p className="text-sm text-gray-500 mt-1">Ingresa la IP del servidor</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="192.168.1.100"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none font-mono"
              inputMode="decimal"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={testConnection}
            disabled={testing || !serverIp.trim()}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {testing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Wifi className="h-5 w-5" />
                Conectar
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Encuentra la IP en WilPOS &gt; Configuración &gt; Conexión
        </p>
      </div>
    </div>
  )
}

// Componente de Login
function Login({ onLogin, apiUrl, onChangeServer }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()

      if (data.success && data.token) {
        localStorage.setItem('wilpos_token', data.token)
        localStorage.setItem('wilpos_user', JSON.stringify(data.user))
        onLogin(data.user, data.token)
      } else {
        setError(data.message || 'Error de autenticación')
      }
    } catch (err) {
      setError('No se pudo conectar al servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">W</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">WilPOS Terminal</h1>
          <p className="text-sm text-gray-500 mt-1">Acceso móvil</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              autoCapitalize="none"
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <button
          onClick={onChangeServer}
          className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Cambiar servidor
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Conectado a: {apiUrl.replace('/api', '').replace('http://', '')}
        </p>
      </div>
    </div>
  )
}

// Componente de Terminal POS
function Terminal({ user, token, apiUrl, onLogout }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('Efectivo')

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/productos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setProducts(data.data || [])
        }
      } catch (err) {
        console.error('Error cargando productos:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [token, apiUrl])

  // Filtrar productos
  const filteredProducts = products.filter(p =>
    p.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    p.codigo_barra?.includes(search)
  )

  // Agregar al carrito
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { ...product, cantidad: 1 }]
    })
  }

  // Actualizar cantidad
  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.cantidad + delta
        return newQty > 0 ? { ...item, cantidad: newQty } : item
      }
      return item
    }).filter(item => item.cantidad > 0))
  }

  // Remover del carrito
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  // Calcular total
  const total = cart.reduce((sum, item) => sum + (item.precio_venta * item.cantidad), 0)

  // Procesar venta
  const handleSale = async () => {
    if (cart.length === 0) return

    setSubmitting(true)
    try {
      const saleData = {
        cliente_id: 1, // Cliente general
        metodo_pago: paymentMethod,
        subtotal: total,
        impuesto: total * 0.18,
        total: total * 1.18,
        detalles: cart.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_venta,
          subtotal: item.precio_venta * item.cantidad
        }))
      }

      const res = await fetch(`${apiUrl}/ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(saleData)
      })

      const data = await res.json()

      if (data.success) {
        setMessage({ type: 'success', text: `Venta #${data.data?.id || ''} registrada` })
        setCart([])
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al procesar venta' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">W</span>
          </div>
          <span className="text-white font-medium">{user?.nombre || 'Terminal'}</span>
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-white/70 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {/* Mensaje de estado */}
      {message && (
        <div className={`mx-4 mt-2 p-3 rounded-xl flex items-center gap-2 animate-fadeIn ${
          message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Panel de productos */}
        <div className="flex-1 flex flex-col bg-white/5 rounded-2xl overflow-hidden">
          {/* Búsqueda */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 overflow-auto p-3">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay productos</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredProducts.slice(0, 50).map(product => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-colors active:scale-95"
                  >
                    <p className="text-white font-medium text-sm truncate">{product.nombre}</p>
                    <p className="text-cyan-400 font-bold">RD$ {product.precio_venta?.toFixed(2)}</p>
                    <p className="text-white/40 text-xs">Stock: {product.stock || 0}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel del carrito */}
        <div className="lg:w-80 flex flex-col bg-white rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-900">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-semibold">Carrito ({cart.length})</span>
            </div>
          </div>

          {/* Items del carrito */}
          <div className="flex-1 overflow-auto p-2 max-h-64 lg:max-h-none">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Carrito vacío</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900 text-sm flex-1 pr-2">{item.nombre}</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg active:bg-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-cyan-500 text-white rounded-lg active:bg-cyan-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900">
                        RD$ {(item.precio_venta * item.cantidad).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Métodos de pago y total */}
          <div className="p-4 border-t border-gray-100 space-y-4">
            {/* Método de pago */}
            <div className="flex gap-2">
              <button
                onClick={() => setPaymentMethod('Efectivo')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  paymentMethod === 'Efectivo'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Banknote className="h-4 w-4" />
                Efectivo
              </button>
              <button
                onClick={() => setPaymentMethod('Tarjeta')}
                className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                  paymentMethod === 'Tarjeta'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                Tarjeta
              </button>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total (ITBIS incl.)</span>
              <span className="text-2xl font-bold text-gray-900">
                RD$ {(total * 1.18).toFixed(2)}
              </span>
            </div>

            {/* Botón de cobrar */}
            <button
              onClick={handleSale}
              disabled={cart.length === 0 || submitting}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
            >
              {submitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Cobrar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// App principal
export default function App() {
  const [apiUrl, setApiUrl] = useState(null)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // Cargar configuración guardada
  useEffect(() => {
    const savedApiUrl = localStorage.getItem('wilpos_api_url')
    const savedToken = localStorage.getItem('wilpos_token')
    const savedUser = localStorage.getItem('wilpos_user')

    if (savedApiUrl) {
      setApiUrl(savedApiUrl)
    }

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleConnect = (url) => {
    setApiUrl(url)
  }

  const handleLogin = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('wilpos_token')
    localStorage.removeItem('wilpos_user')
    setUser(null)
    setToken(null)
  }

  const handleChangeServer = () => {
    localStorage.removeItem('wilpos_api_url')
    localStorage.removeItem('wilpos_server_ip')
    localStorage.removeItem('wilpos_token')
    localStorage.removeItem('wilpos_user')
    setApiUrl(null)
    setUser(null)
    setToken(null)
  }

  // Si no hay servidor configurado
  if (!apiUrl) {
    return <ServerConfig onConnect={handleConnect} />
  }

  // Si no hay usuario logueado
  if (!user || !token) {
    return <Login onLogin={handleLogin} apiUrl={apiUrl} onChangeServer={handleChangeServer} />
  }

  return <Terminal user={user} token={token} apiUrl={apiUrl} onLogout={handleLogout} />
}

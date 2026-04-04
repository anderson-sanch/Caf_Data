import Layout from "../components/layout/Layout";

function ConfiguracionPage() {
  return (
    <Layout title="Configuración">
      <section className="config-card">
        <h3>Configuración General</h3>

        <div className="config-section">
          <h4>Información general</h4>
          <div className="config-grid">
            <label>
              Nombre de la empresa
              <input defaultValue="CAFÉ ONLINE" />
            </label>
            <label>
              NIT
              <input defaultValue="901234567-8" />
            </label>
            <label>
              Dirección
              <input defaultValue="CRA 10 # 20-30" />
            </label>
            <label>
              Teléfono
              <input defaultValue="+57 3000000000" />
            </label>
            <label>
              Correo
              <input defaultValue="info@cafdata.com" />
            </label>
          </div>
        </div>

        <div className="config-section">
          <h4>Configuración regional</h4>
          <div className="config-grid">
            <label>
              Zona horaria
              <input defaultValue="America/Bogota" />
            </label>
            <label>
              Idioma
              <input defaultValue="Español" />
            </label>
            <label>
              Formato de fecha
              <input defaultValue="dd/mm/yyyy" />
            </label>
          </div>
        </div>

        <div className="config-section">
          <h4>Información del negocio</h4>
          <div className="config-grid">
            <label>
              Tipo de negocio
              <input defaultValue="Cafetería de especialidad" />
            </label>
            <label>
              Horario de atención
              <input defaultValue="Lunes a sábado 7:00 - 20:00" />
            </label>
            <label>
              Capacidad máxima
              <input defaultValue="45 personas" />
            </label>
          </div>
        </div>

        <div className="config-section">
          <h4>Configuración de inventario y ventas</h4>
          <div className="config-grid">
            <label>
              Umbral de stock bajo
              <input defaultValue="5 unidades" />
            </label>
            <label>
              Costos de envío
              <input defaultValue="$0" />
            </label>
            <label>
              Método de pago
              <input defaultValue="Efectivo, tarjeta, transferencia" />
            </label>
            <label>
              Descuentos y promociones
              <input defaultValue="Activos" />
            </label>
          </div>
        </div>

        <button type="button" className="toolbar-main save-config-btn">
          Guardar
        </button>
      </section>
    </Layout>
  );
}

export default ConfiguracionPage;
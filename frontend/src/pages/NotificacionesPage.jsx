import Layout from "../components/layout/Layout";

function NotificacionesPage() {
  return (
    <Layout title="Centro de notificaciones">
      <section className="notice-tabs">
        <button type="button" className="toolbar-chip active">Todas</button>
        <button type="button" className="toolbar-chip">Sin leer</button>
        <button type="button" className="toolbar-chip">Críticas</button>
        <button type="button" className="toolbar-chip">Urgentes</button>
      </section>

      <section className="notice-list">
        <article className="notice-card critical">
          <div className="notice-icon critical">!</div>
          <div className="notice-content">
            <div className="notice-title-row">
              <h4>Stock crítico - Café Colombia Premium</h4>
              <span>Hace 5 min</span>
            </div>
            <p>El producto Café Colombia Premium tiene nivel de inventario crítico. Quedan solo 2 unidades.</p>
            <div className="notice-actions">
              <button type="button" className="toolbar-main">Reabastecer ahora</button>
              <button type="button" className="toolbar-chip">Ver producto</button>
            </div>
          </div>
        </article>

        <article className="notice-card warning">
          <div className="notice-icon warning">📅</div>
          <div className="notice-content">
            <div className="notice-title-row">
              <h4>Turno de Personal Próximo a finalizar</h4>
              <span>Hace 1 hora</span>
            </div>
            <p>El turno de María González finaliza en 30 minutos. Programar relevo.</p>
            <div className="notice-actions">
              <button type="button" className="toolbar-chip">Ver turno</button>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  );
}

export default NotificacionesPage;
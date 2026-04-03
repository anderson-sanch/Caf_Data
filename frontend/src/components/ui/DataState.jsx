function DataState({ mode, onRetry }) {
  if (mode === "loading") {
    return <div className="data-state">Cargando información...</div>;
  }

  if (mode === "error") {
    return (
      <div className="data-state">
        <p>No se pudo cargar la información.</p>
        {onRetry ? (
          <button type="button" className="toolbar-chip" onClick={onRetry}>
            Reintentar
          </button>
        ) : null}
      </div>
    );
  }

  if (mode === "empty") {
    return <div className="data-state">No hay datos para mostrar.</div>;
  }

  return null;
}

export default DataState;

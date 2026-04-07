export function CardkpiData({
  title,
  data = 0,
  className = "",
  price = false,
  message,
  smallClassName = "",
}) {
  const formattedNumber = Number(data).toLocaleString("es-CO");
  const prefix = price ? "$" : "";

  return (
    <article className={className}>
      <p>{title}</p>

      <h3>
        {prefix}
        {formattedNumber}
      </h3>

      {message && (
        <small className={smallClassName}>
          {message}
        </small>
      )}
    </article>
  );
}
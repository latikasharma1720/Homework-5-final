export default function SpecialCard({ item }) {
  const { name = "Unknown", price = 0, image = "/assets/menu/default.jpg", description = "" } = item || {};
  const formattedPrice = `$${Number(price).toFixed(2)}`;
  return (
    <article className="menu-card">
      <img src={image} alt={name} className="menu-card__image" />
      <div className="menu-card__content">
        <h3 className="menu-card__name">{name}</h3>
        {description && <p className="menu-card__description">{description}</p>}
        <div className="menu-card__footer">
          <span className="menu-card__price">{formattedPrice}</span>
        </div>
      </div>
    </article>
  );
}


const NotFound = () => {
  return (
    <main className="main_not_found">
      <div className="not_found_content">
        <span className="brand_name">Quote Games</span>
        
        <h1 className="error_code">404</h1>
        <h2 className="error_message">Page non trouvée</h2>

        <a href="/" className="btn_home">
          Retourner au menu
        </a>
      </div>
    </main>
  );
}

export default NotFound;
import { Link } from "react-router-dom";

const NoPage = () => {
  return (
    <>
      <h1>Error 404</h1>
      <p>
        Lost?
      </p>
      <p>There's no place like <Link to="/">Home</Link></p>
    </>
  )
};

export default NoPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import Nav from "react-bootstrap/Nav";
import ProfileCard from "./ProfileCard";
import "./Discover.css";
import Spinner from "react-bootstrap/Spinner";
import { FaUser, FaFire, FaCode, FaBrain, FaEllipsisH } from "react-icons/fa";

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [webDevUsers, setWebDevUsers] = useState([]);
  const [mlUsers, setMlUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("for-you");

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/user/registered/getDetails`);
        setUser(data.data);
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      }
    };
    const getDiscoverUsers = async () => {
      try {
        const { data } = await axios.get("/user/discover");
        setDiscoverUsers(data.data.forYou);
        setWebDevUsers(data.data.webDev);
        setMlUsers(data.data.ml);
        setOtherUsers(data.data.others);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        }
        localStorage.removeItem("userInfo");
        setUser(null);
        await axios.get("/auth/logout");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getUser();
    getDiscoverUsers();
  }, [navigate, setUser]);

  const renderProfiles = (users) => {
    if (users && users.length > 0) {
      return users.map((user) => (
        <ProfileCard
          key={user._id}
          profileImageUrl={user?.picture}
          name={user?.name}
          rating={user?.rating ? user?.rating : 5}
          bio={user?.bio}
          skills={user?.skillsProficientAt}
          username={user?.username}
        />
      ));
    }
    return <h1 className="no-users-message">No users to show</h1>;
  };

  return (
    <div className="discover-page">
      <div className="content-container">
        <div className="nav-bar">
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link onClick={() => setActiveFilter("for-you")} className="nav-link">
              <FaUser className="nav-icon" /> For You
            </Nav.Link>
            <Nav.Link onClick={() => setActiveFilter("popular")} className="nav-link">
              <FaFire className="nav-icon" /> Popular
            </Nav.Link>
            <Nav.Link onClick={() => setActiveFilter("web-development")} className="nav-link">
              <FaCode className="nav-icon" /> Web Development
            </Nav.Link>
            <Nav.Link onClick={() => setActiveFilter("machine-learning")} className="nav-link">
              <FaBrain className="nav-icon" /> Machine Learning
            </Nav.Link>
            <Nav.Link onClick={() => setActiveFilter("others")} className="nav-link">
              <FaEllipsisH className="nav-icon" /> Others
            </Nav.Link>
          </Nav>
        </div>
        <div className="heading-container">
          {loading ? (
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {activeFilter === "for-you" && (
                <section id="for-you">
                  <h2 className="discover-heading">For You</h2>
                  <div className="profile-cards">{renderProfiles(discoverUsers)}</div>
                </section>
              )}
              {activeFilter === "popular" && (
                <section id="popular">
                  <h2 className="discover-heading">Popular</h2>
                  <div className="profile-cards">{renderProfiles(webDevUsers)}</div>
                </section>
              )}
              {activeFilter === "web-development" && (
                <section id="web-development">
                  <h2 className="discover-heading">Web Development</h2>
                  <div className="profile-cards">{renderProfiles(webDevUsers)}</div>
                </section>
              )}
              {activeFilter === "machine-learning" && (
                <section id="machine-learning">
                  <h2 className="discover-heading">Machine Learning</h2>
                  <div className="profile-cards">{renderProfiles(mlUsers)}</div>
                </section>
              )}
              {activeFilter === "others" && (
                <section id="others">
                  <h2 className="discover-heading">Others</h2>
                  <div className="profile-cards">{renderProfiles(otherUsers)}</div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;

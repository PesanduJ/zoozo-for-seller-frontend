import UserNavBar from "../userHeader";
import UserProductsTable from "./allProducts";
import SalesBySellerId from "./salesOfSeller";
import TopSellers from "./topSellers";
import "../../styles/userDashboard.css";
function UserDashboard() {
  return (
    <>
      <UserNavBar />
      <section class="layout">
        <div class="sidebar">
          <UserProductsTable />
          <br />
          <br />
          <SalesBySellerId />
        </div>
        <div class="body">
          
        </div>
      </section>
    </>
  );
}

export default UserDashboard;

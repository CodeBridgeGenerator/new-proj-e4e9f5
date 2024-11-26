import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

import BranchesPage from "../BranchesPage/BranchesPage";
import DepartmentsPage from "../DepartmentsPage/DepartmentsPage";
import ProfilesPage from "../ProfilesPage/ProfilesPage";
import CompanyAddressesPage from "../CompanyAddressesPage/CompanyAddressesPage";
import CompanyPhonesPage from "../CompanyPhonesPage/CompanyPhonesPage";
import EmployeesPage from "../EmployeesPage/EmployeesPage";

const SingleCompaniesPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  useEffect(() => {
    //on mount
    client
      .service("companies")
      .get(urlParams.singleCompaniesId, {
        query: {
          $populate: [
            {
              path: "createdBy",
              service: "users",
              select: ["name"],
            },
            {
              path: "updatedBy",
              service: "users",
              select: ["name"],
            },
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const addresses = Array.isArray(res.addresses)
          ? res.addresses.map((elem) => ({
            _id: elem._id,
            Street1: elem.Street1,
          }))
          : res.addresses
            ? [{ _id: res.addresses._id, Street1: res.addresses.Street1 }]
            : [];
        setAddresses(addresses);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Companies",
          type: "error",
          message: error.message || "Failed get companies",
        });
      });
  }, [props, urlParams.singleCompaniesId]);

  const goBack = () => {
    navigate("/companies");
  };

  const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

  const menuItems = [
    {
      label: "Copy link",
      icon: "pi pi-copy",
      command: () => copyPageLink(),
    },
    {
      label: "Help",
      icon: "pi pi-question-circle",
      command: () => toggleHelpSidebar(),
    },
  ];

  const handleEditNavigation = () => {
    console.log("_entity:", companyId)
    navigate(`/companies/edit/${companyId}`);
  };

  return (
    <ProjectLayout>
      <div className="col-12 flex flex-column align-items-center">
        <div className="col-12">
          <div className="flex align-items-center justify-content-between">
            <div className="flex align-items-center">
              <Button
                className="p-button-text"
                icon="pi pi-chevron-left"
                onClick={() => goBack()}
              />
              <h3 className="m-0">Companies</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>
            <div>
              <Button
                label="Delete"
                // onClick={handleCancel}
                className="p-button-rounded p-button-secondary"
                style={{
                  backgroundColor: "white",
                  color: "#D30000",
                  border: "2px solid #D30000",
                  height: "30px",
                }}
              />
              <Button
                label="Edit"
                onClick={handleEditNavigation}
                className="ml-4 p-button-rounded p-button-primary"
                style={{ height: "30px", width: "80px" }}
              />
            </div>
          </div>
        </div>
        <div className="grid w-full mt-5 ml-3">
          <div className="col-12 md:col-6 lg:col-3 mb-10">
            <label className="text-sm text-gray-600">Name</label>
            <p className="m-0 ">{_entity?.name}</p>
          </div>
          <div className="col-12 md:col-6 lg:col-3 mb-10">
            <label className="text-sm text-gray-600 ">Company no</label>
            <p className="m-0 ">{_entity?.companyNo}</p>
          </div>
          <div className="col-12 md:col-6 lg:col-3 mb-10">
            <label className="text-sm text-gray-600">New company number</label>
            <p className="m-0 ">{Number(_entity?.newCompanyNumber)}</p>
          </div>
          <div className="col-12 md:col-6 lg:col-3 mb-10">
            <label className="text-sm text-gray-600">Date Incorporated</label>
            <p id="DateIncorporated" className="m-0 ">
              {_entity?.DateIncorporated}
            </p>
          </div>
          <div className="col-12 md:col-6 lg:col-3 mb-10">
            <label className="text-sm text-gray-600">Is default</label>
            <p className="m-0 ">
              <i
                id="isdefault"
                className={`pi ${_entity?.isdefault === true ? "pi-check" : "pi-times"}`}
              ></i>
            </p>
          </div>
          <div className="col-12 md:col-6 lg:col-3 mb-10">
            <label className="text-sm text-gray-600">Addresses</label>
            {addresses.map((elem) => (
              <Link key={elem._id} to={`/companyAddresses/${elem._id}`}>
                <div>
                  <p className="text-xl text-primary">{elem.Street1}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>



      <div className=" mt-20 ml-3" >
        <TabView>
          <TabPanel header="Branches" leftIcon="pi pi-building-columns mr-2">
            <BranchesPage />
          </TabPanel>
          <TabPanel header="Departments" leftIcon="pi pi-briefcase mr-2">
            <DepartmentsPage />
          </TabPanel>
          <TabPanel header="Profiles" leftIcon="pi pi-user mr-2">
            <ProfilesPage />
          </TabPanel>
          <TabPanel header="Company Addresses" leftIcon="pi pi-map mr-2">
            <CompanyAddressesPage />
          </TabPanel>
          <TabPanel header="Company Phones" leftIcon="pi pi-phone mr-2">
            <CompanyPhonesPage />
          </TabPanel>
          <TabPanel header="Employees" leftIcon="pi pi-building-columns mr-2">
            <EmployeesPage />
          </TabPanel>
        </TabView>
      </div>

      <CommentsSection
        recordId={urlParams.singleCompaniesId}
        user={props.user}
        alert={props.alert}
        serviceName="companies"
      />

      <div
        id="rightsidebar"
        className={classNames(
          "overlay-auto z-10 surface-overlay shadow-2 fixed top-0 right-0 w-20rem animation-duration-150 animation-ease-in-out",
          { hidden: !isHelpSidebarVisible, block: isHelpSidebarVisible }
        )}
        style={{
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="flex flex-column h-full p-4 bg-white" style={{ height: "calc(100% - 60px)", marginTop: "60px" }}>
          <span className="text-xl font-medium text-900 mb-3">Help bar</span>
          <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
        </div>
      </div>

    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleCompaniesPage);

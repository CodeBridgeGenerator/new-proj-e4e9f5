import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import client from "../../../../services/restClient";
import { TabView, TabPanel } from "primereact/tabview";

const UserServices = (props) => {
  const [userData, setUserData] = useState([]);
  const [profileData, setProfileData] = useState([]); 
  const [userInviteData, setUserInviteData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeIndex === 0) {
          // Fetch users data
          const res = await client
            .service("users")
            .find({ query: { $limit: 5 } });
          setUserData(res.data);
        } else if (activeIndex === 1) {
          // Fetch profiles data
          const res = await client
            .service("profiles")
            .find({ query: { $limit: 5 } });
            setProfileData(res.data);
        } else if (activeIndex === 2) {
          // Fetch userInvites data
          const res = await client
            .service("userInvites")
            .find({ query: { $limit: 5 } });
            setUserInviteData(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        props.alert({
          title: "Error",
          type: "error",
          message: error.message || "Failed to fetch data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeIndex, props]);

  const dropdownTemplate0 = (rowData, { rowIndex }) => (
    <p>{rowData.userId?.name}</p>
  );

  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header="Users">
        <div className="users-table"> 
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={userData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="email" header="Email" sortable />
              <Column
                field="status"
                header="Status"
                sortable
              />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="Profiles">
        <div className="profiles-table">
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={profileData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="bio" header="Bio" sortable />
              <Column field="skills" header="Skills" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="User Invites">
        <div className="user-invites-table"> 
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={userInviteData} rows={5}>
              <Column field="emailToInvite" header="Email To Invite" sortable />
              <Column field="status" header="Status" sortable />
              <Column field="code" header="Code" sortable />
              <Column field="sendMailCounter" header="Send Mail Counter" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>
    </TabView>
  );
};

export default UserServices;

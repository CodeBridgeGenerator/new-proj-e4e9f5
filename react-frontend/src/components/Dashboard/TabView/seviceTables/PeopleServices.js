import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import client from "../../../../services/restClient";
import { TabView, TabPanel } from "primereact/tabview";

const PeopleServices = (props) => {
  const [roleData, setRoleData] = useState([]); 
  const [positionData, setPositionData] = useState([]); 
  const [permissionData, setPermissionData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeIndex === 0) {
          // Fetch roles data 
          const res = await client
            .service("roles")
            .find({ query: { $limit: 5 } });
          setRoleData(res.data);
        } else if (activeIndex === 1) {
          // Fetch positions data 
          const res = await client
            .service("positions")
            .find({ query: { $limit: 5 } });
          setPositionData(res.data);
        } else if (activeIndex === 2) {
          // Fetch permission services data 
          const res = await client
            .service("permissionServices")
            .find({ query: { $limit: 5 } });
          setPermissionData(res.data);
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


  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header="Roles">
        <div className="roles-table">
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={roleData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="description" header="Description" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="Positions">
        <div className="positions-table">
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={positionData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="description" header="Description" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="Permissions">
        <div className="permissions-table">
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={permissionData} rows={5}>
              <Column field="service" header="Service" sortable />
              <Column field="create" header="Create" sortable />
              <Column field="read" header="Read" sortable />
              <Column field="update" header="Update" sortable />
              <Column field="delete" header="Delete" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>
    </TabView>
  );
};

export default PeopleServices;

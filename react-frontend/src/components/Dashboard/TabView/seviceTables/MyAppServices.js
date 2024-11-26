import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import client from "../../../../services/restClient";
import { TabView, TabPanel } from "primereact/tabview";

const CompanyServices = (props) => {
  const [companyData, setCompanyData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Track active tab

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeIndex === 0) {
          // Fetch companies data
          const res = await client
            .service("student")
            .find({ query: { $limit: 5 } });
          setCompanyData(res.data);
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
    <p>{rowData.companyId?.name}</p>
  );

  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header="Students">
        <div className="companies-table">
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={companyData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="image" header="Image" sortable />
              
            </DataTable>
          )}
        </div>
      </TabPanel>

    </TabView>
  );
};

export default CompanyServices;

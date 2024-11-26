import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import client from "../../../../services/restClient";
import { TabView, TabPanel } from "primereact/tabview";

const AdminServices = (props) => {
  const [jobData, setJobData] = useState([]); 
  const [mailJobData, setMailJobData] = useState([]); 
  const [errorLogData, setErrorLogData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeIndex === 0) {
          // Fetch Dynaloader Jobs data
          const res = await client
            .service("jobQues")
            .find({ query: { $limit: 5 } });
          setJobData(res.data);
        } else if (activeIndex === 1) {
          // Fetch Mail Jobs data
          const res = await client
            .service("mailQues")
            .find({ query: { $limit: 5 } });
          setMailJobData(res.data);
        } else if (activeIndex === 2) {
          // Fetch Error Logs data
          const res = await client
            .service("errorLogs")
            .find({ query: { $limit: 5 } });
          setErrorLogData(res.data);
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
    <p>{rowData.jobId?.name}</p> 
  );

  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header="Dynaloader Jobs">
        <div className="jobs-table"> 
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={jobData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="type" header="Type" sortable />
              <Column field="data" header="Data" sortable />
              <Column field="service" header="Service" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="Mail Jobs">
        <div className="mail-jobs-table">
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={mailJobData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="from" header="From" sortable />
              <Column field="recipients" header="Recipients" sortable />
              <Column field="status" header="Status" sortable />
              <Column field="content" header="Content" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="Error Logs">
        <div className="error-logs-table"> 
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={errorLogData} rows={5}>
              <Column field="serviceName" header="Service Name" sortable />
              <Column field="errorMessage" header="Error Message" sortable />
              <Column field="stack" header="Stack" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>
    </TabView>
  );
};

export default AdminServices;

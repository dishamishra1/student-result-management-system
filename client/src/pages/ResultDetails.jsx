import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";
import ResultView from "../components/ResultView";

function ResultDetails() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/results/student/${id}`).then(res => setResult(res.data));
  }, [id]);

  return (
    <Layout title="Student Result Details" subtitle="Detailed academic report with analytics and recommendations.">
      {result ? <ResultView result={result} /> : <div className="empty-state">Loading...</div>}
    </Layout>
  );
}

export default ResultDetails;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type ApiResponse = {
    items: string[];
};

const DataFetcher: React.FC = () => {
    const [data, setData] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Use the correct environment variable or direct URL as needed
          const response = await axios.get<ApiResponse>(`${process.env.REACT_APP_API_BASE_URL}/flask/test`);
          setData(response.data.items);
        } catch (error) {
          console.error('There was an error fetching the data', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);
  
    return (
      <div>
        {loading ? 'Loading...' : data.map((item, index) => <p key={index}>{item}</p>)}
      </div>
    );
  };
  
  export default DataFetcher;

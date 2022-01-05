import { useState } from "react";
import axios from "axios";
import { API_URI } from "@commons/constants/urls";

export const useFetchCourse = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    axios
      .post(`${API_URI}/user/get_course`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

export const useFetchLessons = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    axios
      .post(`${API_URI}/user/videos_by_course`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

export const useFetchTracking = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso, idVideo, minutoVisto, completoVista) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    payload.append("idVideo", idVideo);
    payload.append("minutoVisto", minutoVisto);
    payload.append("completoVista", completoVista ? "SI" : "NO");
    axios
      .post(`${API_URI}/user/update_view_video`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

export const useFetchEmail = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso, email) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    payload.append("email", email);
    axios
      .post(`${API_URI}/email/send_certificate`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

export const useFetchDownloadCertificate = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    axios
      .post(`${API_URI}/email/download_certificate`, payload, {
        responseType: 'blob',
      })
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

export const useFetchQuestions = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso, idVideo) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    payload.append("idVideo", idVideo);
    axios
      .post(`${API_URI}/user/questions_by_video`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

export const useFetchQuestionsCourse = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    axios
      .post(`${API_URI}/user/questions_by_course`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

export const useFetchResponse = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso, idVideo, respuestas) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    payload.append("idVideo", idVideo);
    payload.append("respuestas", JSON.stringify(respuestas));
    axios
      .post(`${API_URI}/user/send_response`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};


export const useFetchResponseQuestionary = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = (token, idCurso, respuestas) => {
    const payload = new FormData();
    payload.append("token", token);
    payload.append("idCurso", idCurso);
    payload.append("respuestas", JSON.stringify(respuestas));
    axios
      .post(`${API_URI}/user/send_response_questionary`, payload)
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  return {
    fetch: fetchData,
    data: response,
    loading,
    error,
  };
};

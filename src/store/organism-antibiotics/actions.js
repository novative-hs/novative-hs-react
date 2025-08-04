import{
  GET_ORGANISM_LIST,
  GET_ORGANISM_LIST_SUCCESS,
  GET_ORGANISM_LIST_FAIL,
  ADD_ORGANISM_LIST,
  ADD_ORGANISM_LIST_SUCCESS,
  ADD_ORGANISM_LIST_FAIL,
  UPDATE_ORGANISM_LIST,
  UPDATE_ORGANISM_LIST_SUCCESS,
  UPDATE_ORGANISM_LIST_FAIL,
  DELETE_ORGANISM_LIST,
  DELETE_ORGANISM_LIST_SUCCESS,
  DELETE_ORGANISM_LIST_FAIL,
  ////////////////
  GET_ANTIBIOTIC_LIST,
  GET_ANTIBIOTIC_LIST_SUCCESS,
  GET_ANTIBIOTIC_LIST_FAIL,
  ADD_ANTIBIOTIC_LIST,
  ADD_ANTIBIOTIC_LIST_SUCCESS,
  ADD_ANTIBIOTIC_LIST_FAIL,
  UPDATE_ANTIBIOTIC_LIST,
  UPDATE_ANTIBIOTIC_LIST_SUCCESS,
  UPDATE_ANTIBIOTIC_LIST_FAIL,
  DELETE_ANTIBIOTIC_LIST,
  DELETE_ANTIBIOTIC_LIST_SUCCESS,
  DELETE_ANTIBIOTIC_LIST_FAIL,
  } from "./actionTypes";
 

  //////////////Analyte////////////
  export const getOrganismlist = (id) => ({
    type: GET_ORGANISM_LIST,
    payload: id,
  });
  
  export const getOrganismlistSuccess = (AnalyteList) => {
    console.log("Analyte response in success action:", AnalyteList); 
    return {
      type: GET_ORGANISM_LIST_SUCCESS,
      payload: AnalyteList,
    };
  };
  
  export const getOrganismlistFail = (error) => {
    console.log("Error response in fail action:", error); 
    return {
      type: GET_ORGANISM_LIST_FAIL,
      payload: error,
    };
  };

  export const addOrganismlist = (id) => ({
      type: ADD_ORGANISM_LIST,
      payload: id,
    });
  
    export const addOrganismlistSuccess = (OrganinismList) => {
      console.log("Analyte response in success action:", OrganinismList);
      return {
      type: ADD_ORGANISM_LIST_SUCCESS,
      payload: OrganinismList,
    }};
    
    export const addOrganismlistFail = error => ({
      type: ADD_ORGANISM_LIST_FAIL,
      payload: error,
    });


  export const updateorganism = (id) => ({
      type: UPDATE_ORGANISM_LIST,
      payload: id,
    });
  
    export const updateorganismSuccess = (OrganinismList) => {
      console.log("Analyte response in success action:", OrganinismList);
      return {
      type: UPDATE_ORGANISM_LIST_SUCCESS,
      payload: OrganinismList,
    }};
    
    export const updateorganismFail = error => ({
      type: UPDATE_ORGANISM_LIST_FAIL,
      payload: error,
    });

  export const deleteorganism = (id) => ({
      type: DELETE_ORGANISM_LIST,
      payload: id,
    });
  
    export const deleteorganismSuccess = (OrganinismList) => {
      console.log("Analyte response in success action:", OrganinismList);
      return {
      type: DELETE_ORGANISM_LIST_SUCCESS,
      payload: OrganinismList,
    }};
    
    export const deleteorganismFail = error => ({
      type: DELETE_ORGANISM_LIST_FAIL,
      payload: error,
    });

    export const getAntibioticlist = (id) => ({
    type: GET_ANTIBIOTIC_LIST,
    payload: id,
  });
  
  export const getAntibioticlistSuccess = (AnalyteList) => {
    console.log("Analyte response in success action:", AnalyteList); 
    return {
      type: GET_ANTIBIOTIC_LIST_SUCCESS,
      payload: AnalyteList,
    };
  };
  
  export const getAntibioticlistFail = (error) => {
    console.log("Error response in fail action:", error); 
    return {
      type: GET_ANTIBIOTIC_LIST_FAIL,
      payload: error,
    };
  };

  export const addAntibioticlist = (id) => ({
      type: ADD_ANTIBIOTIC_LIST,
      payload: id,
    });
  
    export const addAntibioticlistSuccess = (AntibioticList) => {
      console.log("Analyte response in success action:", AntibioticList);
      return {
      type: ADD_ANTIBIOTIC_LIST_SUCCESS,
      payload: AntibioticList,
    }};
    
    export const addAntibioticlistFail = error => ({
      type: ADD_ANTIBIOTIC_LIST_FAIL,
      payload: error,
    });


  export const updateantibiotic = (id) => ({
      type: UPDATE_ANTIBIOTIC_LIST,
      payload: id,
    });
  
    export const updateantibioticSuccess = (AntibioticList) => {
      console.log("Analyte response in success action:", AntibioticList);
      return {
      type: UPDATE_ANTIBIOTIC_LIST_SUCCESS,
      payload: AntibioticList,
    }};
    
    export const updateantibioticFail = error => ({
      type: UPDATE_ANTIBIOTIC_LIST_FAIL,
      payload: error,
    });

  export const deleteantibiotic = (id) => ({
      type: DELETE_ANTIBIOTIC_LIST,
      payload: id,
    });
  
    export const deleteantibioticSuccess = (AntibioticList) => {
      console.log("Analyte response in success action:", AntibioticList);
      return {
      type: DELETE_ANTIBIOTIC_LIST_SUCCESS,
      payload: AntibioticList,
    }};
    
    export const deleteantibioticFail = error => ({
      type: DELETE_ANTIBIOTIC_LIST_FAIL,
      payload: error,
    });
  
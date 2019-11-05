pragma solidity ^0.5.8;
//import "remix_tests.sol";
import "../contracts/med_chain.sol";

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";


contract Testmed_chain {
    
    med_chain private testContract;
 
    //address private testAddress = 0x8881c6CFFDA34224E0B3cc62eaeeF56cCe28Aad7;
    
    // patient's info for use with add_paitent
    uint aadhaar = 1;
    uint age = 100;
    string name = "name";
    string dob = "dob";
    uint weight = 150;
    string sex = "sex"; 
    string allergies = "allergies";
    
    // resulted patient info after function call
    uint res_aadhaar;
    uint res_age;
    string res_name;
    string res_dob;
    uint res_weight;
    string res_sex; 
    string res_allergies;
    
    // doc perscriptoin info for use with add_prescription
    uint d_id = 2;
    uint p_id = 0;
    string disease = "disease";
    string symptoms = "symptoms";
    string medicine = "medicine";
    string time = "time";
    string timestamp_prescribed = "";
    
    // resulted perscriptoin info after function call
    string res_p_id;
    string  res_medicine;
    string  res_symptoms;
    uint res_d_id;
    string res_timestamp_prescribed;
  
    // medical history details params
    string ids = "--1";
    uint per_ids = 1;
    string d_ids = "--2";
    string symptoms_ = "--symptoms";
    // medical history params
    string dis_ = "--disease";
    string med_ = "--medicine";
    string time_ = "--time";

    // resulted history after function call
    uint res_per_ids;
    string res_d_ids;
    string res_ids;
    string res_dis_;
    string res_med_;
    string res_time_;

    // creating a contract instance and calling add_paitent and add_prescription
    // also, forcing it to run before any tests (remix runs tests alphabatically)
    function beforeEach() external {
        testContract = new med_chain();
        testContract.add_paitent(aadhaar, age, name, dob, weight, sex, allergies);
        testContract.add_prescription(d_id, aadhaar, disease, symptoms, medicine, time);
    }
    
    // test lookup_paitent
    function testLookUpPaitent() external {
      //  testContract = new med_chain();
        (res_aadhaar, res_age, res_name, res_sex, res_dob, res_weight, res_allergies) = testContract.lookup_paitent(aadhaar);
        Assert.equal(aadhaar, res_aadhaar, "Pateint's aadhaar does not match");
        Assert.equal(age, res_age, "Pateint's age does not match");
        Assert.equal(name, res_name, "Pateint's name does not match");
        Assert.equal(dob, res_dob, "Pateint's dob does not match");
        Assert.equal(weight, res_weight, "Pateint's weight does not match");
        Assert.equal(sex, res_sex, "Pateint's sex does not match");
        Assert.equal(allergies, res_allergies, "Pateint's allergies does not match");
    }

    // test patient's last_prescription
    function testLast_prescription() external {
        (res_medicine) = testContract.last_prescription(aadhaar);
         Assert.equal(medicine, res_medicine, "Pateint's last perscriptoin does not match");
    }
    
    // test doctor_last_prescription
    function testDoctorLastPrescription() external{
      (res_per_ids, res_medicine, res_d_id, res_symptoms, res_time_) = testContract.doctor_last_prescription(aadhaar);
      Assert.equal(per_ids, res_per_ids, "Doctor last pesrctiption's p_id does not match");
      Assert.equal(d_id, res_d_id, "Doctor last pesrctiption's d_id does not match");
      Assert.equal(medicine, res_medicine, "Doctor last pesrctiption's medicine does not match");
      Assert.equal(symptoms, res_symptoms, "Doctor last pesrctiption's symptoms do not match");
      Assert.equal(timestamp_prescribed, res_timestamp_prescribed, "Doctor last pesrctiption's timestamp does not match");
    }
    
    // test mdeical history part 1
    function testMedicalHistoryDetails() external{
        (res_ids, res_d_ids, res_symptoms) = testContract.medical_history_details(aadhaar);
        Assert.equal(ids, res_ids, "Patient's id in medical history conflict");
        Assert.equal(d_ids, res_d_ids, "Doctor ids in medical history conflict");
        Assert.equal(symptoms_, res_symptoms, "Patient's sysmptoms in medical history conflict");
    }
    
    // test mdeical history part 1
    function testMedicalHistory() external{
        (res_dis_, res_med_, res_time_) = testContract.medical_history(aadhaar);
        Assert.equal(res_dis_, dis_, "Patient's dis in medical history conflict");
        Assert.equal(res_med_, med_, "Patient's med in medical history conflict");
        Assert.equal(res_time_, time_, "Patient's time in medical history conflict");
    }
}
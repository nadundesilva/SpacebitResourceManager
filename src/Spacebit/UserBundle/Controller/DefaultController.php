<?php

namespace Spacebit\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

class DefaultController extends Controller
{
    public function homeAction()
    {
        return $this->render('SpacebitUserBundle:Default:home.html.twig');
    }

    public function loginAction()
    {
        if ($this->get('login_authenticator')->authenticateGuestLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_index'));
        }
        return $this->render('SpacebitUserBundle:Default:login.html.twig');
    }

    public function signupAction()
    {
        if ($this->get('login_authenticator')->authenticateGuestLogin()) {
            return new RedirectResponse($this->generateUrl('spacebit_index'));
        }
        return $this->render('SpacebitUserBundle:Default:signup.html.twig');
    }

    public function logoutAction() {
        $this->get('session')->invalidate();
        return new Response('success');
    }

    public function forgotPasswordAction()
    {
        return $this->render('SpacebitUserBundle:Default:forgot-password.html.twig');
    }

    public function validateUserAction()
    {
        $request = Request::createFromGlobals();
        $name = $request->request->get('name');
        $password = $request->request->get('password');

        $conn = $this->get('database_connection');
        //$stmt = $conn->prepare('SELECT user_id,password FROM login WHERE user_id = :name;');
        $stmt = $conn->prepare('SELECT * FROM login INNER JOIN user USING (user_id) WHERE user_id = :name;');
        $stmt->bindValue(':name', $name);
        $stmt->execute();
        $result = $stmt->fetchall();

        if ( $result == false){
            return new Response("fail");
        }
        if ( $result[0]["password"] != $password){
            return new Response("incorrect");
        }

        $userId = $result[0]["user_id"];
        $firstName = $result[0]["first_name"];
        $lastName = $result[0]["last_name"];
        $accessLevel = $result[0]["access_level"];

        $variable = $this->get('session');

        $variable->set('user_id', $userId );
        $variable->set('first_name', $firstName );
        $variable->set('last_name', $lastName );
        $variable->set('access_level', $accessLevel );

        return new Response("success");
    }


    public function addUserAction()
    {
        $request = Request::createFromGlobals();
        $userID = $request->request->get('userID');
        $firstName = $request->request->get('firstName');
        $middleName = $request->request->get('middleName');
        $lastName = $request->request->get('lastName');
        $email = $request->request->get('email');
        $telephoneNumber = $request->request->get('telephoneNumber');
        $passwordOne = $request->request->get('passwordOne');
        $accessLevel = $request->request->get('accessLevel');


        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('INSERT INTO user VALUES (:userID ,:firstName,:middleName,:lastName,:email, :telephoneNumber,:accessLevel,1  );');
        $stmt->bindValue(':userID', $userID);
        $stmt->bindValue(':firstName', $firstName);
        $stmt->bindValue(':middleName', $middleName);
        $stmt->bindValue(':lastName', $lastName);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':telephoneNumber', $telephoneNumber);
        $stmt->bindValue(':accessLevel', $accessLevel);

        $stmt->execute();

        $stmt = $conn->prepare('INSERT INTO login (user_id,password) VALUES (:userId ,:passwordOne);');
        $stmt->bindValue(':userId', $userID);
        $stmt->bindValue(':passwordOne', $passwordOne);

        $stmt->execute();

        //guest
        if ($accessLevel == 0){

            $nic = $request->request->get('nic');
            $organizationAddress = $request->request->get('organizationAddress');
            $title = $request->request->get('title');
            $organizationEmail = $request->request->get('organizationEmail');
            $organizationTelephone = $request->request->get('organizationTelephone');

            $stmt = $conn->prepare('INSERT INTO guest VALUES (:userID ,:nic,:organizationAddress,:title,:organizationEmail, :organizationTelephone );');
            $stmt->bindValue(':userID', $userID);
            $stmt->bindValue(':nic', $nic);
            $stmt->bindValue(':organizationAddress', $organizationAddress);
            $stmt->bindValue(':title', $title);
            $stmt->bindValue(':organizationEmail', $organizationEmail);
            $stmt->bindValue(':organizationTelephone', $organizationTelephone);

            $stmt->execute();

        }
        //student
        if ($accessLevel == 1){

            $department = $request->request->get('department');
            $batch = $request->request->get('batch');

            $stmt = $conn->prepare('INSERT INTO student VALUES (:userID ,:department,:batch );');
            $stmt->bindValue(':userID', $userID);
            $stmt->bindValue(':department', $department);
            $stmt->bindValue(':batch', $batch);

            $stmt->execute();

        }
        //staff
        if ($accessLevel == 2){

            $department = $request->request->get('department');
            $designation = $request->request->get('designation');

            $stmt = $conn->prepare('INSERT INTO staff VALUES (:userID ,:department,:designation );');
            $stmt->bindValue(':userID', $userID);
            $stmt->bindValue(':department', $department);
            $stmt->bindValue(':designation', $designation);

            $stmt->execute();

        }

        $variable = $this->get('session');

        $variable->set('user_id', $userID );
        $variable->set('first_name', $firstName );
        $variable->set('last_name', $lastName );
        $variable->set('access_level', $accessLevel );

        return new Response("success");


    }

    public function loadDepartmentsAction(){

        $conn = $this->get('database_connection');
        //$stmt = $conn->prepare('SELECT user_id,password FROM login WHERE user_id = :name;');
        $stmt = $conn->prepare('SELECT dept_name FROM department;');

        $stmt->execute();
        $result = $stmt->fetchall();

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function checkUserAvailability(){
        $request = Request::createFromGlobals();
        $userID = $request->request->get('userID');
        $email = $request->request->get('email');

        $conn = $this->get('database_connection');

        if ($userID != ""){
            $stmt = $conn->prepare('SELECT * FROM user WHERE user_id = :userID;');
            $stmt->bindValue(':userID', $userID);
        }
        if ($email != ""){
            $stmt = $conn->prepare('SELECT * FROM user WHERE email = :email;');
            $stmt->bindValue(':email', $email);
        }

        //$stmt = $conn->prepare('SELECT user_id,password FROM login WHERE user_id = :name;');

        $stmt->execute();
        $result = $stmt->fetchall();

        if ( $result == false){
            return new Response("fail");
        }

        else{
            return new Response("success");
        }

    }


}

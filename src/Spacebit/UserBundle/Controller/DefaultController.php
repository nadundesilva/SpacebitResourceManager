<?php

namespace Spacebit\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function homeAction()
    {
        return $this->render('SpacebitUserBundle:Default:home.html.twig');
    }

    public function loginAction()
    {
        return $this->render('SpacebitUserBundle:Default:login.html.twig');
    }

    public function signupAction()
    {
        return $this->render('SpacebitUserBundle:Default:signup.html.twig');
    }
    public function validateUserAction()
    {
        $request = Request::createFromGlobals();
        $name = $request->request->get('name');
        $password = $request->request->get('password');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT user_id,password FROM login WHERE user_id = :name;');
        $stmt->bindValue(':name', $name);
        $stmt->execute();
        $result = $stmt->fetchall();

        if ( $result == false){
            return new Response("fail");
        }
        else{


        }

        $response = new Response(json_encode(array('result' => $result)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;

//        return new Response($password);


    }


    public function addUserAction()
    {
        $request = Request::createFromGlobals();
        $userId = $request->request->get('userId');
        $firstName = $request->request->get('firstName');
        $middleName = $request->request->get('middleName');
        $lastName = $request->request->get('lastName');
        $email = $request->request->get('email');
        $telephoneNumber = $request->request->get('telephoneNumber');
        $accessLevelNo = $request->request->get('accessLevelNo');
        $password1 = $request->request->get('password1');


        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('INSERT INTO user VALUES (:userId ,:firstName,:middleName,:lastName,:email, :telephoneNumber,:accessLevelNo,1  );');
        $stmt->bindValue(':userId', $userId);
        $stmt->bindValue(':firstName', $firstName);
        $stmt->bindValue(':middleName', $middleName);
        $stmt->bindValue(':lastName', $lastName);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':telephoneNumber', $telephoneNumber);
        $stmt->bindValue(':accessLevelNo', $accessLevelNo);

        $stmt->execute();

        $stmt = $conn->prepare('INSERT INTO login VALUES (:userId ,:password1);');
        $stmt->bindValue(':userId', $userId);
        $stmt->bindValue(':password1', $password1);

        $stmt->execute();

    }
}

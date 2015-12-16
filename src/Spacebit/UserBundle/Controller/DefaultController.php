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

//        $conn = $this->get('database_connection');
//        $stmt = $conn->prepare('SELECT into resource values(:resource_id , :availability , :description);');

//        echo $name."<br>";
//        echo $password."<br>";



//        $availability = $availability =='on'? true : false;

//
//        $stmt = $conn->prepare('INSERT into resource values(:resource_id , :availability , :description);');
//        $stmt->bindValue(':resource_id', $resource_id);
//        $stmt->bindValue(':availability', $availability);
//        $stmt->bindValue(':description',$description );
//        $stmt->execute();
//
//        $stmt = $conn->prepare('INSERT into equipment values(:resource_id , :value1);');
//        $stmt->bindValue(':resource_id', $resource_id);
//        $stmt->bindValue(':value1', $value1);
//
//        $stmt->execute();

        return new Response('success');
    }
}

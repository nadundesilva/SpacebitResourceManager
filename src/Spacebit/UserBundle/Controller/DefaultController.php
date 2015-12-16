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
        $name = $request->query->get('name');
        $password = $request->query->get('password');

        echo $name."<br>";
        echo $password."<br>";


        //post - request
        //get - query

//        $conn = $this->get('database_connection');
//        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE type = :category;');
//        $stmt->bindValue(':category', $category);
//        $stmt->execute();
//        $resiil = $stmt->fetchAll();
//
//        $response = new Response(json_encode(array('rows' => $rows)));
//        $response->headers->set('Content-Type', 'application/json');
//
//        return $response;
    }
}

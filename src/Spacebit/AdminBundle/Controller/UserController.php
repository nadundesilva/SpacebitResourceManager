<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class UserController extends Controller
{
    function usersAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM user ORDER BY active DESC;');
        $stmt->bindValue(':access_level', $this->get('session')->get('access_level'));
        $stmt->execute();
        $users = $stmt->fetchAll();

        return $this->render('SpacebitAdminBundle:Default:users.html.twig', array(
            'users'=>$users,
        ));
    }

    function activateAction()
    {
        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');
        $active = ($request->request->get('status') == "true" ? 1 : 0);

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('UPDATE user SET active = :active WHERE user_id = :user_id;');
        $stmt->bindValue(':active', $active);
        $stmt->bindValue(':user_id', $user_id);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }

    function changeAccessLevelAction()
    {
        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');
        $access_level = $request->request->get('access-level');

        $conn = $this->get('database_connection');

        $stmt = $conn->prepare('UPDATE user SET access_level = :access_level WHERE user_id = :user_id;');
        $stmt->bindValue(':access_level', $access_level);
        $stmt->bindValue(':user_id', $user_id);

        $response = 'success';
        if(!$stmt->execute()) {
            $response = $stmt->errorCode();
        }

        return new Response($response);
    }

    function getDetailsAction()
    {
        $request = Request::createFromGlobals();
        $user_id = $request->request->get('user-id');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT first_name, middle_name, last_name, email, telephone_no, access_level FROM user WHERE user_id = :user_id;');
        $stmt->bindValue(':user_id', $user_id);
        $stmt->execute();
        $user = $stmt->fetch();

        if($user['access_level'] == 0) {
            $stmt = $conn->prepare('SELECT nic, address, organizational_title, organizational_email, organizational_telephone FROM guest WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['nic'] = $result['nic'];
            $user['address'] = $result['address'];
            $user['organizational_title'] = $result['organizational_title'];
            $user['organizational_email'] = $result['organizational_email'];
            $user['organizational_telephone'] = $result['organizational_telephone'];
        } else if ($user['access_level'] == 1) {
            $stmt = $conn->prepare('SELECT dept_name, batch FROM student WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['dept_name'] = $result['dept_name'];
            $user['batch'] = $result['batch'];
        } else {
            $stmt = $conn->prepare('SELECT dept_name, designation FROM staff WHERE user_id = :user_id;');
            $stmt->bindValue(':user_id', $user_id);
            $stmt->execute();
            $result = $stmt->fetch();
            $user['dept_name'] = $result['dept_name'];
            $user['designation'] = $result['designation'];
        }

        $response = new Response(json_encode(array('result' => $user)));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
